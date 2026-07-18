using ManageMachine.Application.DTOs.Users;

namespace ManageMachine.Application.DTOs.Admin
{
    public class AdminSummaryDto : UserDto
    {
        public int UserCount { get; set; }
        public int MachineCount { get; set; }
    }
}
