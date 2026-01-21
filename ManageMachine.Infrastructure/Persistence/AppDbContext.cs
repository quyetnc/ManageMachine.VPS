using ManageMachine.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ManageMachine.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Machine> Machines { get; set; }
        public DbSet<MachineType> MachineTypes { get; set; }

        public DbSet<MachineTransferRequest> MachineTransferRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);



            modelBuilder.Entity<Machine>()
                .HasOne(m => m.User)
                .WithMany(u => u.Machines)
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Machine Tenant Relationship
            modelBuilder.Entity<Machine>()
                .HasOne(m => m.Tenant)
                .WithMany() // Assuming User doesn't need a collection of 'BorrowedMachines' for now
                .HasForeignKey(m => m.TenantId)
                .OnDelete(DeleteBehavior.SetNull);

            // Transfer Request Relationships
            modelBuilder.Entity<MachineTransferRequest>()
                .HasOne(r => r.FromUser)
                .WithMany()
                .HasForeignKey(r => r.FromUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MachineTransferRequest>()
                .HasOne(r => r.ToUser)
                .WithMany()
                .HasForeignKey(r => r.ToUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MachineTransferRequest>()
                .HasOne(r => r.Machine)
                .WithMany(m => m.TransferRequests)
                .HasForeignKey(r => r.MachineId)
                .OnDelete(DeleteBehavior.Cascade);



            modelBuilder.Entity<Machine>()
                .HasOne(m => m.MachineType)
                .WithMany(mt => mt.Machines)
                .HasForeignKey(m => m.MachineTypeId);
        }
    }
}
