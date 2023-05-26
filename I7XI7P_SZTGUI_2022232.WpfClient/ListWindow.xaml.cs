using I7XI7P_SZTGUI_2022232.WpfClient.ViewModels;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace I7XI7P_SZTGUI_2022232.WpfClient
{
    /// <summary>
    /// Interaction logic for ListWindow.xaml
    /// </summary>
    public partial class ListWindow : Window
    {
        public ListWindow(IList list)
        {
            InitializeComponent();
            DataContext = App.Current.Services.GetService<ListWindowViewModel>();
            (DataContext as ListWindowViewModel).Setup(list);
        }
    }
}
