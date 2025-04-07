package introduction;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.WebDriver;

public class SelIntroduction {

	public static void main(String[] args){
		//Invoking class
		//FirefoxDriver driver = new FirefoexDriver();
		
		//step to invoke chrome driver
		//System.setProperties("webdriver.chrome.driver","path");
		WebDriver driver = new ChromeDriver();
		
		driver.get("https://www.sitecore.com/");
		
		//driver.getTitle(); To get the title
		System.out.println(driver.getTitle());
		
		String curl = driver.getCurrentUrl() ;//To get the current url
		System.out.println(curl);

		driver.close();
	}

}
