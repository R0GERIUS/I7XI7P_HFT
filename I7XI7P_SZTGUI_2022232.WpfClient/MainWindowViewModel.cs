using AKFAC0_HFT_2021222.Models;
using CommunityToolkit.Mvvm.ComponentModel;
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
    public class MainWindowViewModel : ObservableRecipient
    {
        private readonly string host = "http://localhost:30703/";

        private string errorMessage;

        public string ErrorMessage
        {
            get { return errorMessage; }
            set { SetProperty(ref errorMessage, value); }
        }


        public RestCollection<Armor> Armors { get; set; }
        public RestCollection<Job> Jobs { get; set; }
        public RestCollection<Weapon> Weapons { get; set; }

        public ICommand AddArmorCommand { get; set; }
        public ICommand AddJobCommand { get; set; }
        public ICommand AddWeaponCommand { get; set; }
        public ICommand DeleteArmorCommand { get; set; }
        public ICommand DeleteJobCommand { get; set; }
        public ICommand DeleteWeaponCommand { get; set; }
        public ICommand UpdateArmorCommand { get; set; }
        public ICommand UpdateJobCommand { get; set; }
        public ICommand UpdateWeaponCommand { get; set; }

        private Armor selectedArmor;
        public Armor SelectedArmor
        {
            get { return selectedArmor; }
            set { 
                selectedArmor = value;
                OnPropertyChanged();
                ((RelayCommand)DeleteArmorCommand).NotifyCanExecuteChanged();
            }
        }
        private Job selectedJob;
        public Job SelectedJob
        {
            get { return selectedJob; }
            set {
                if (value != null)
                {
                    selectedJob = new Job()
                    {
                        Id = value.Id,
                        Name = value.Name,
                        Role = value.Role
                    };
                    OnPropertyChanged();
                    ((RelayCommand)DeleteJobCommand).NotifyCanExecuteChanged();
                }
            }
        }
        private Weapon selectedWeapon;
        public Weapon SelectedWeapon
        {
            get { return selectedWeapon; }
            set { 
                selectedWeapon = value;
                OnPropertyChanged();
                ((RelayCommand)DeleteWeaponCommand).NotifyCanExecuteChanged();
            }
        }



        public MainWindowViewModel()
        {
            Armors = new RestCollection<Armor>(host, "armor", "hub");
            Jobs = new RestCollection<Job>(host, "job", "hub");
            Weapons = new RestCollection<Weapon>(host, "weapon", "hub");

            AddArmorCommand = new RelayCommand(() =>
            {
                Armors.Add(new Armor()
                {
                    BaseDefense = SelectedArmor.BaseDefense,
                    Name = SelectedArmor.Name
                });
            });
            AddJobCommand = new RelayCommand(() =>
            {
                Jobs.Add(new Job()
                {
                    Role = SelectedJob.Role,
                    Name = SelectedJob.Name
                });
            });
            AddWeaponCommand = new RelayCommand(() =>
            {
                Weapons.Add(new Weapon()
                {
                    BaseDamage = SelectedWeapon.BaseDamage,
                    Name = SelectedWeapon.Name
                });
            });
            
            DeleteArmorCommand = new RelayCommand(() =>
            {
                Armors.Delete(SelectedArmor.Id);
            }, () =>
            {
                return SelectedArmor != null;
            });
            DeleteJobCommand = new RelayCommand(() =>
            {
                Jobs.Delete(SelectedJob.Id);
            }, () =>
            {
                return SelectedJob != null;
            });
            DeleteWeaponCommand = new RelayCommand(() =>
            {
                Weapons.Delete(SelectedWeapon.Id);
            }, () =>
            {
                return SelectedWeapon != null;
            });
            
            UpdateArmorCommand = new RelayCommand(() =>
            {
                try
                {
                    Armors.Update(SelectedArmor);
                }
                catch (ArgumentException ex)
                {
                    ErrorMessage = ex.Message;
                }
            });
            UpdateJobCommand = new RelayCommand(() =>
            {
                try
                {
                    Jobs.Update(SelectedJob);
                }
                catch (ArgumentException ex)
                {
                    ErrorMessage = ex.Message;
                }
            });
            UpdateWeaponCommand = new RelayCommand(() =>
            {
                try
                {
                    Weapons.Update(SelectedWeapon);
                }
                catch (ArgumentException ex)
                {
                    ErrorMessage = ex.Message;
                }
            });

            SelectedArmor = new Armor();
            SelectedJob = new Job();
            SelectedWeapon = new Weapon();
        }
    }
}
