using System;

namespace ManageMachine.Application.Common
{
    public interface ICurrentUserService
    {
        int? UserId { get; }
        int? AdminId { get; }
        Domain.Enums.UserRole? Role { get; }
    }
}
