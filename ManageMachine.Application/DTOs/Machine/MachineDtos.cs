using System;
using System.Collections.Generic;

namespace ManageMachine.Application.DTOs.Machine
{
    public class MachineTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class CreateMachineTypeDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }


    






    public class MachineDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public int MachineTypeId { get; set; }
        public string MachineTypeName { get; set; } = string.Empty;
        public int? UserId { get; set; } // Owner
        public string? UserFullName { get; set; } 
        public int? TenantId { get; set; }
        public string? TenantName { get; set; }
        public string Status { get; set; } = string.Empty;
        public int? PendingTransferRequestId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime DateIssued { get; set; }


    }

    public class CreateMachineDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public DateTime? DateIssued { get; set; }
        public int MachineTypeId { get; set; }
        public int? UserId { get; set; } // Admin assigns this

    }
}
