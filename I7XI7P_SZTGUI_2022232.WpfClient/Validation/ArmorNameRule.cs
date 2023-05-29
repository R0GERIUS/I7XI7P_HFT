using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace I7XI7P_SZTGUI_2022232.WpfClient.Validation
{
    public class ArmorNameRule : ValidationRule
    {
        public override ValidationResult Validate(object value, CultureInfo cultureInfo)
        {
            if (value == null || ((string)value).Length == 0)
            {
                return new ValidationResult(false, "Armor name cannot be empty");
            }
            else
            {
                if (((string)value).Length < 3)
                {
                    return new ValidationResult(false, "Armor name is too short");
                }
                else if (((string)value).Contains('?'))
                {
                    return new ValidationResult(false, "Armor name contains illegal characters");
                }
                else
                    return ValidationResult.ValidResult;
            }
        }
    }
}
