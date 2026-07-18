using ManageMachine.Application.Common;
using ManageMachine.Domain.Enums;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace ManageMachine.Infrastructure.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int? UserId
        {
            get
            {
                var idClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)
                              ?? _httpContextAccessor.HttpContext?.User?.FindFirst(JwtRegisteredClaimNames.Sub);
                
                if (idClaim != null && int.TryParse(idClaim.Value, out int userId))
                {
                    return userId;
                }
                return null;
            }
        }

        public int? AdminId
        {
            get
            {
                var adminClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("AdminId");
                
                if (adminClaim != null && int.TryParse(adminClaim.Value, out int adminId))
                {
                    return adminId;
                }

                // Fallback: If no AdminId claim, check if current user is Admin?
                // Actually, if they are Admin, AdminId claim should be their own Id (if set in DB).
                // Or maybe they just registered and don't have claim yet?
                // For safety, rely on Claim.
                
                return null;
            }
        }

        public UserRole? Role
        {
            get
            {
                var roleClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Role);
                if (roleClaim != null && Enum.TryParse(roleClaim.Value, out UserRole role))
                {
                    return role;
                }
                return null;
            }
        }
    }
}
