using AKFAC0_HFT_2021222.Models;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using I7XI7P_SZTGUI_2022232.WpfClient.Services;
using System;
using System.Collections.Generic;
using System.Windows.Input;

namespace I7XI7P_SZTGUI_2022232.WpfClient.ViewModels
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

        // CRUD Commands
        public ICommand AddArmorCommand { get; set; }
        public ICommand AddJobCommand { get; set; }
        public ICommand AddWeaponCommand { get; set; }
        public ICommand DeleteArmorCommand { get; set; }
        public ICommand DeleteJobCommand { get; set; }
        public ICommand DeleteWeaponCommand { get; set; }
        public ICommand UpdateArmorCommand { get; set; }
        public ICommand UpdateJobCommand { get; set; }
        public ICommand UpdateWeaponCommand { get; set; }

        // Non CRUD Commands
        public ICommand GetAllJobArmorsCommand { get; set; }
        public ICommand GetAverageDefenceByClassCommand { get; set; }
        public ICommand GetAverageDefenceCommand { get; set; }
        public ICommand GetAllJobsByRoleCommmand { get; set; }
        public ICommand GetAllWeaponByRoleCommand { get; set; }
        public ICommand GetAllWeaponByRoleMinimumDmgCommand { get; set; }
        public ICommand GetHighestDMGWeaponByGivenRoleCommand { get; set; }
        public ICommand GetAllJobWeaponsCommand { get; set; }
        public ICommand GetAverageDamageByJobCommand { get; set; }
        public ICommand GetAverageDamageCommand { get; set; }

        private Armor selectedArmor;
        public Armor SelectedArmor
        {
            get { return selectedArmor; }
            set
            {
                selectedArmor = value;
                OnPropertyChanged();
                ((RelayCommand)DeleteArmorCommand).NotifyCanExecuteChanged();
            }
        }
        private Job selectedJob;
        public Job SelectedJob
        {
            get { return selectedJob; }
            set
            {
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
                    ((RelayCommand)GetAllJobArmorsCommand).NotifyCanExecuteChanged();
                    ((RelayCommand)GetAverageDefenceByClassCommand).NotifyCanExecuteChanged();
                    ((RelayCommand)GetAllJobsByRoleCommmand).NotifyCanExecuteChanged();
                    ((RelayCommand)GetAllWeaponByRoleCommand).NotifyCanExecuteChanged();
                    ((RelayCommand)GetAllWeaponByRoleMinimumDmgCommand).NotifyCanExecuteChanged();
                    ((RelayCommand)GetHighestDMGWeaponByGivenRoleCommand).NotifyCanExecuteChanged();
                    ((RelayCommand)GetAllJobWeaponsCommand).NotifyCanExecuteChanged();
                    ((RelayCommand)GetAverageDamageByJobCommand).NotifyCanExecuteChanged();
                }
            }
        }
        private Weapon selectedWeapon;
        public Weapon SelectedWeapon
        {
            get { return selectedWeapon; }
            set
            {
                selectedWeapon = value;
                OnPropertyChanged();
                ((RelayCommand)DeleteWeaponCommand).NotifyCanExecuteChanged();
            }
        }

        private int minDmg;

        public int MinDmg
        {
            get { return minDmg; }
            set
            {
                minDmg = value;
                OnPropertyChanged();
            }
        }


        private IList<Armor> allJobArmors;

        public IList<Armor> AllJobArmors
        {
            get { return allJobArmors; }
            set
            {
                allJobArmors = value;
                OnPropertyChanged();
            }
        }

        private double averageDefenceByClass;

        public double AverageDefenceByClass
        {
            get { return averageDefenceByClass; }
            set
            {
                averageDefenceByClass = value;
                OnPropertyChanged();
            }
        }

        private double averageDefence;

        public double AverageDefence
        {
            get { return averageDefence; }
            set
            {
                averageDefence = value;
                OnPropertyChanged();
            }
        }

        private IList<Job> allJobsByRole;

        public IList<Job> AllJobsByRole
        {
            get { return allJobsByRole; }
            set
            {
                allJobsByRole = value;
                OnPropertyChanged();
            }
        }

        private IList<Weapon> allWeaponByRole;

        public IList<Weapon> AllWeaponByRole
        {
            get { return allWeaponByRole; }
            set
            {
                allWeaponByRole = value;
                OnPropertyChanged();
            }
        }

        private IList<Weapon> allWeaponByRoleMinimumDmg;

        public IList<Weapon> AllWeaponByRoleMinimumDmg
        {
            get { return allWeaponByRoleMinimumDmg; }
            set
            {
                allWeaponByRoleMinimumDmg = value;
                OnPropertyChanged();
            }
        }

        private IList<Weapon> allJobWeapons;

        public IList<Weapon> AllJobWeapons
        {
            get { return allJobWeapons; }
            set
            {
                allJobWeapons = value;
                OnPropertyChanged();
            }
        }


        private Weapon highestDmgWeaponBySelectedRole;

        public Weapon HighestDmgWeaponBySelectedRole
        {
            get { return highestDmgWeaponBySelectedRole; }
            set
            {
                highestDmgWeaponBySelectedRole = value;
                OnPropertyChanged();
            }
        }

        private double averageDamageBySelectedJob;

        public double AverageDamageBySelectedJob
        {
            get { return averageDamageBySelectedJob; }
            set
            {
                averageDamageBySelectedJob = value;
                OnPropertyChanged();
            }
        }

        private double averageDamage;

        public double AverageDamage
        {
            get { return averageDamage; }
            set
            {
                averageDamage = value;
                OnPropertyChanged();
            }
        }


        public MainWindowViewModel()
        {
            CustomRestService restService = new CustomRestService(host);
            IShowListService showListService = new ShowListViaWindow();

            Armors = new RestCollection<Armor>(host, "armor", "hub");
            Jobs = new RestCollection<Job>(host, "job", "hub");
            Weapons = new RestCollection<Weapon>(host, "weapon", "hub");

            // CRUD Commands
            AddArmorCommand = new RelayCommand(() =>
            {
                Armors.Add(new Armor()
                {
                    BaseDefense = SelectedArmor.BaseDefense,
                    Name = SelectedArmor.Name,
                    JobId = SelectedArmor.JobId
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
                    Name = SelectedWeapon.Name,
                    JobId = SelectedWeapon.JobId
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

            // Non CRUD Commands
            GetAllJobArmorsCommand = new RelayCommand(() =>
            {
                try
                {
                    AllJobArmors = restService.GetAllJobArmors(SelectedJob.Name);
                    showListService.ShowList((System.Collections.IList)AllJobArmors);
                }
                catch (ArgumentException ex)
                {
                    ErrorMessage = ex.Message;
                }
            }, () =>
            {
                return SelectedJob.Name != null;
            });
            GetAverageDefenceByClassCommand = new RelayCommand(() =>
            {
                try
                {
                    AverageDefenceByClass = restService.GetAverageDefenceByClass(SelectedJob.Name);
                }
                catch (ArgumentException ex)
                {
                    ErrorMessage = ex.Message;
                }
            }, () =>
            {
                return SelectedJob.Name != null;
            });
            GetAverageDefenceCommand = new RelayCommand(() =>
            {
                AverageDefence = restService.GetAverageDefence();
            });
            GetAllJobsByRoleCommmand = new RelayCommand(() =>
            {
                try
                {
                    AllJobsByRole = restService.GetAllJobsByRole(SelectedJob.Role);
                    showListService.ShowList((System.Collections.IList)AllJobsByRole);
                }
                catch (ArgumentException ex)
                {

                    ErrorMessage = ex.Message;
                }
            }, () =>
            {
                return SelectedJob.Role != null;
            });
            GetAllWeaponByRoleCommand = new RelayCommand(() =>
            {
                try
                {
                    AllJobsByRole = restService.GetAllJobsByRole(SelectedJob.Role);
                }
                catch (ArgumentException ex)
                {

                    ErrorMessage = ex.Message;
                }
            }, () =>
            {
                return SelectedJob.Role != null;
            });
            GetAllWeaponByRoleMinimumDmgCommand = new RelayCommand(() =>
            {
                try
                {
                    AllWeaponByRoleMinimumDmg = restService.GetAllWeaponByRoleMinimumDmg(SelectedJob.Role, MinDmg);
                    showListService.ShowList((System.Collections.IList)AllWeaponByRoleMinimumDmg);
                }
                catch (ArgumentException ex)
                {
                    ErrorMessage = ex.Message;
                }
            }, () =>
            {
                return SelectedJob.Role != null;
            });
            GetHighestDMGWeaponByGivenRoleCommand = new RelayCommand(() =>
            {
                try
                {
                    HighestDmgWeaponBySelectedRole = restService.GetHighestDMGWeaponByGivenRole(SelectedJob.Role);
                }
                catch (ArgumentException ex)
                {
                    ErrorMessage = ex.Message;
                }
            }, () =>
            {
                return SelectedJob.Role != null;
            });
            GetAllJobWeaponsCommand = new RelayCommand(() =>
            {
                try
                {
                    AllJobWeapons = restService.GetAllJobWeapons(SelectedJob.Name);
                    showListService.ShowList((System.Collections.IList)AllJobWeapons);
                }
                catch (ArgumentException ex)
                {
                    ErrorMessage = ex.Message;
                }
            }, () =>
            {
                return SelectedJob.Name != null;
            });
            GetAverageDamageByJobCommand = new RelayCommand(() =>
            {
                try
                {
                    AverageDamageBySelectedJob = restService.GetAverageDamageByJob(SelectedJob.Name);
                }
                catch (ArgumentException ex)
                {
                    ErrorMessage = ex.Message;
                }
            }, () =>
            {
                return SelectedJob.Name != null;
            });
            GetAverageDamageCommand = new RelayCommand(() =>
            {
                AverageDamage = restService.GetAverageDamage();
            });

            SelectedArmor = new Armor();
            SelectedJob = new Job();
            SelectedWeapon = new Weapon();

            MinDmg = 0;

            AllJobArmors = new List<Armor>();
            AverageDefence = 0;
            AverageDefenceByClass = 0;
            AllJobsByRole = new List<Job>();
            AllWeaponByRole = new List<Weapon>();
            AllWeaponByRoleMinimumDmg = new List<Weapon>();
            HighestDmgWeaponBySelectedRole = new Weapon();
            AllJobWeapons = new List<Weapon>();
            averageDamageBySelectedJob = 0;
            AverageDamage = 0;
        }
    }
}
