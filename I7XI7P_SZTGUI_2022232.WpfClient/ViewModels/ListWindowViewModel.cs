using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace I7XI7P_SZTGUI_2022232.WpfClient.ViewModels
{
    public class ListWindowViewModel
    {
        public IList DisplayList { get; set; }

        public void Setup(IList displayList) 
        {
            this.DisplayList = displayList;
        }
    }
}
