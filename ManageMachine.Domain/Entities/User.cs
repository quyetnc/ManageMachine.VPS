using ManageMachine.Domain.Common;
using ManageMachine.Domain.Enums;

namespace ManageMachine.Domain.Entities
{
    public class User : BaseEntity
    {
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public ICollection<Machine> Machines { get; set; } = new List<Machine>();
        
        public int? AdminId { get; set; } // The Tenant ID (If user is Admin, this matches their own Id)
    }
}
