using AutoMapper;
using ManageMachine.Application.Common;
using ManageMachine.Application.DTOs.Users;
using ManageMachine.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ManageMachine.Application.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IGenericRepository<User> _userRepository;
        private readonly IGenericRepository<Machine> _machineRepository;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUserService;

        public UserService(
            IGenericRepository<User> userRepository, 
            IGenericRepository<Machine> machineRepository,
            IMapper _mapper, 
            ICurrentUserService currentUserService)
        {
            _userRepository = userRepository;
            _machineRepository = machineRepository;
            this._mapper = _mapper;
            _currentUserService = currentUserService;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<IEnumerable<DTOs.Admin.AdminSummaryDto>> GetAdminsAsync()
        {
            // Fetch Admins
            var admins = await _userRepository.GetAsync(u => u.Role == Domain.Enums.UserRole.Admin);
            var summaries = new List<DTOs.Admin.AdminSummaryDto>();

            foreach (var admin in admins)
            {
                var dto = _mapper.Map<DTOs.Admin.AdminSummaryDto>(admin);
                
                // Count Users belonging to this Admin
                var users = await _userRepository.GetAsync(u => u.AdminId == admin.Id);
                dto.UserCount = System.Linq.Enumerable.Count(users);

                // Count Machines belonging to this Admin
                var machines = await _machineRepository.GetAsync(m => m.AdminId == admin.Id);
                dto.MachineCount = System.Linq.Enumerable.Count(machines);

                summaries.Add(dto);
            }

            return summaries;
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
        {
            var existing = await _userRepository.GetAsync(u => u.Username == createUserDto.Username);
            if (System.Linq.Enumerable.Any(existing))
            {
                throw new Exception("Username already exists");
            }

            var user = _mapper.Map<User>(createUserDto);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password);
            
            // If NOT SuperAdmin, assign current AdminId (Standard user creation)
            if (_currentUserService.Role != Domain.Enums.UserRole.SuperAdmin)
            {
                 user.AdminId = _currentUserService.AdminId;
                 user.Role = Domain.Enums.UserRole.User; // Enforce regular user role if not SuperAdmin
            }
            else
            {
                // If SuperAdmin creating user
                // If they are creating an ADMIN, we don't set AdminId yet, or we set it to their own ID later?
                // Actually, if creating an Admin, they are a new Tenant.
                // So AdminId should be null initially, then set to their own ID after save.
                if (createUserDto.Role == Domain.Enums.UserRole.Admin)
                {
                    user.AdminId = null; // Will be set to ID after save
                }
                else
                {
                    // SuperAdmin creating a regular user? Who does it belong to?
                    // Maybe SuperAdmin belongs to their own "System" tenant?
                    // For now, assume SuperAdmin primarily creates Admins. 
                    // If creating regular user, maybe let them pick? Or just assign to SuperAdmin?
                    user.AdminId = _currentUserService.AdminId; 
                }
            }

            await _userRepository.AddAsync(user);

            // Post-creation logic for new Tenants
            if (user.Role == Domain.Enums.UserRole.Admin)
            {
                user.AdminId = user.Id;
                await _userRepository.UpdateAsync(user);
            }

            // Post-creation for SuperAdmin?
            if (user.Role == Domain.Enums.UserRole.SuperAdmin)
            {
                 user.AdminId = user.Id; // Self-tenant
                 await _userRepository.UpdateAsync(user);
            }
            
            return _mapper.Map<UserDto>(user);
        }

        public async Task ResetPasswordAsync(int userId, string newPassword)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) throw new Exception("User not found");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _userRepository.UpdateAsync(user);
        }

        public async Task<UserDto> UpdateUserAsync(int id, UpdateUserDto updateUserDto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) throw new Exception("User not found");

            user.FullName = updateUserDto.FullName;
            user.Email = updateUserDto.Email;
            user.Role = updateUserDto.Role;

            await _userRepository.UpdateAsync(user);
            return _mapper.Map<UserDto>(user);
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) throw new Exception("User not found");

            await _userRepository.DeleteAsync(user);
        }

        public async Task<UserDto> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) throw new Exception("User not found");
            return _mapper.Map<UserDto>(user);
        }
    }
}
