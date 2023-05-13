using AKFAC0_HFT_2021222.Models;
using CommunityToolkit.Mvvm.Input;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace I7XI7P_SZTGUI_2022232.WpfClient
{
    public class MainWindowViewModel
    {
        private readonly string host = "http://localhost:30703/";

        public RestCollection<Armor> Armors { get; set; }
        public RestCollection<Job> Jobs { get; set; }
        public RestCollection<Weapon> Weapons { get; set; }

        public string ArmorName { get; set; }
        public int ArmorBaseDefense { get; set; }
        public string JobName { get; set; }
        public string JobRole { get; set; }
        public string WeaponName { get; set; }
        public int WeaponBaseDamage { get; set; }

        public ICommand PutArmorCommand { get; set; }
        public ICommand PutJobCommand { get; set; }
        public ICommand PutWeaponCommand { get; set; }

        public MainWindowViewModel()
        {
            Armors = new RestCollection<Armor>(host, "armor", "hub");
            Jobs = new RestCollection<Job>(host, "job", "hub");
            Weapons = new RestCollection<Weapon>(host, "weapon", "hub");

            PutArmorCommand = new RelayCommand(() =>
            {
                Armors.Update(new Armor()
                {
                    BaseDefense = ArmorBaseDefense,
                    Name = ArmorName
                });
            });
            PutJobCommand = new RelayCommand(() =>
            {
                Jobs.Update(new Job()
                {
                    Role = JobRole,
                    Name = JobName
                });
            });
            PutWeaponCommand = new RelayCommand(() =>
            {
                Weapons.Update(new Weapon()
                {
                    BaseDamage = WeaponBaseDamage,
                    Name = WeaponName
                });
            }, () =>
            {
                return !(string.IsNullOrEmpty(WeaponName)) && WeaponBaseDamage > 0;
            });
        }
    }
}
