using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.Mvc;

namespace DynamicForms.Controllers
{
    public class DynamicFormController : Controller
    {

        public Item GetItemFromId(string itemId)
        {
            Item item = Sitecore.Context.Database.GetItem(itemId);
            return item ?? null;
        }

        [HttpGet]
        // GET: DynamicForm
        public ActionResult GetForm(string formID)
        {
            Item formItem = Sitecore.Context.Database.GetItem(formID);
            MultilistField formInputsList = formItem.Fields["InputControls"];
            Item[] formInputs = formInputsList == null ? null : formInputsList.GetItems();
            List<Object> inputObjects = new List<Object>();
            foreach(var inp in formInputs)
            {
                if(inp != null)
                {
                    Item inputType = GetItemFromId(inp.Fields["Type"].Value);
                    MultilistField validationItemList = inp.Fields["Validation"];
                    Item[] validationItems = validationItemList == null ? null : validationItemList.GetItems();
                    List<Object> validationObjects = new List<Object>();
                    foreach(var val in validationItems)
                    {
                        Object valObj = new
                        {
                            error_message = val.Fields["ErrorMessage"].Value,
                            validation_regex = val.Fields["validationRegex"].Value,
                            title = val.Fields["Title"].Value
                        };
                        validationObjects.Add(valObj);
                    }


                    if (inputType.Fields["Title"].Value == "Checkbox")
                    {
                        MultilistField checkboxItemsList = inp.Fields["CheckboxItems"];
                        Item[] checkboxItems = checkboxItemsList == null ? null : checkboxItemsList.GetItems();
                        List<string> checkboxList = new List<string>();
                        
                        foreach(var checkboxes in checkboxItems)
                        {
                            checkboxList.Add(checkboxes.Fields["Label"].Value);
                        }
                        Object checkboxInp = new
                        {
                            input_type = inputType.Fields["Title"].Value,
                            label = inp.Fields["Label"].Value,
                            input_name = inp.Fields["Name"].Value,
                            checkbox_items = checkboxList,
                            validations = validationObjects
                        };
                        inputObjects.Add(checkboxInp);
                    }
                    else if(inputType.Fields["Title"].Value == "Radio")
                    {
                        MultilistField radioItemsList = inp.Fields["CheckboxItems"];
                        Item[] radioItems = radioItemsList == null ? null : radioItemsList.GetItems();
                        List<string> radioList = new List<string>();

                        foreach (var radioBut in radioItems)
                        {
                            radioList.Add(radioBut.Fields["Label"].Value);
                        }
                        Object radioInp = new
                        {
                            input_type = inputType.Fields["Title"].Value,
                            label = inp.Fields["Label"].Value,
                            input_name = inp.Fields["Name"].Value,
                            radio_items = radioList,
                            validations = validationObjects
                        };
                        inputObjects.Add(radioInp);
                    }
                    else if(inputType.Fields["Title"].Value == "Select")
                    {
                        MultilistField selectItemList = inp.Fields["Options"];
                        Item[] selectItem = selectItemList == null ? null : selectItemList.GetItems();
                        List<Object> selectList = new List<Object>();

                        foreach (var options in selectItem)
                        {
                            Object optionObj = new
                            {
                                option_value = options.Fields["Value"].Value,
                                option_text = options.Fields["Text"].Value,
                            };
                            selectList.Add(optionObj);
                        }
                        Object selectInp = new
                        {
                            input_type = inputType.Fields["Title"].Value,
                            label = inp.Fields["Label"].Value,
                            input_name = inp.Fields["Name"].Value,
                            select_items = selectList,
                            validations = validationObjects
                        };
                        inputObjects.Add(selectInp);
                    }
                    else
                    {

                        Object simpleInp = new
                        {
                            input_type = inputType.Fields["Title"].Value,
                            label = inp.Fields["Label"].Value,
                            input_name = inp.Fields["Name"].Value,
                            placeholder = inp.Fields["Placeholder"].Value,
                            validations = validationObjects
                        };
                        inputObjects.Add(simpleInp);
                    }
                }
            }
            Object jsonData = new
            {
                form_name = formItem.Fields["FormTitle"].Value,
                form_description = formItem.Fields["FormDescription"].Value,
                method = formItem.Fields["FormMethod"].Value,
                action_url = formItem.Fields["FormAction"].Value,
                inputs = inputObjects
            };

            
            return Json(new { success = true, item = jsonData }, JsonRequestBehavior.AllowGet);
        }
    }
}