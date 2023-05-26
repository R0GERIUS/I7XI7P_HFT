using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace I7XI7P_SZTGUI_2022232.WpfClient.Services
{
    public class ShowListViaWindow : IShowListService
    {
        public void ShowList(IList list)
        {
            new ListWindow(list).ShowDialog();
        }
    }
}
