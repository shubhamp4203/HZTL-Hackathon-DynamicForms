package introduction;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.time.Duration;
import java.util.List;

public class hackthon {

	public static void main(String[] args){
		WebDriver driver = new ChromeDriver();
		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
		driver.get("https://rahulshettyacademy.com/locatorspractice");
		
		//<input type="text" placeholder="Username" id="inputUsername" value="">
		driver.findElement(By.id("inputUsername")).sendKeys("Gia");
		
		//<input type="password" placeholder="Password" name="inputPassword" value="">
		driver.findElement(By.name("inputPassword")).sendKeys("Gia@123");
		
		//<button class="submit signInBtn" type="submit">Sign In</button>
		
//		List<WebElement> Btns = driver.findElements(By.cssSelector("button[type='submit']"));
//		System.out.println(Btns.size());
		
		driver.findElement(By.cssSelector("button[type='submit']")).click();
		
		//<div class="forgot-pwd-container"><a href="#">Forgot your password?</a></div>
		//driver.findElement(By.className("forgot-pwd-container")).click();
		
		//<input type="checkbox" id="chkboxOne" name="chkboxOne" value="rmbrUsername">
		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(2));
		driver.findElement(By.id("chkboxOne")).click();
		
		//<p class="error">* Incorrect username or password </p>
		String error = driver.findElement(By.cssSelector("p.error")).getText();
		System.out.println(error);
		
	}
}

