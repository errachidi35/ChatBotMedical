package com.tabibiMicroserviceInscription.tabibiMicroserviceInscription;

import com.tabibiMicroserviceInscription.tabibiMicroserviceInscription.entities.User;
import com.tabibiMicroserviceInscription.tabibiMicroserviceInscription.services.UserRepo;
import org.springframework.stereotype.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.tabibiMicroserviceInscription.tabibiMicroserviceInscription.services.UserService;

@Controller
public class UserController {

    private final UserService userService;
    @Autowired
    UserRepo userRepo;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/index")
    public String index() {
        return "index";
    }

    @PostMapping("/login")
    public String login(@RequestParam String email, @RequestParam String password) {
        User user = userService.findByUsername(email);
        if (user != null && user.getPassword().equals(password)) {
            // Authentication successful
            return "redirect:/options";
        } else {
            // Authentication failed
            return "redirect:/login?error";
        }
    }

    @GetMapping("/home")
    public String home() {
        return "home";
    }

  @GetMapping("/personalized_home")
  public String personalized_home(){
        return "personalized_home";
    }

    @GetMapping("/options")
    public String options() {
        return "options";
    }

    @GetMapping("/signup")
    public String showSignupPage() {
        return "signup";
    }

    @PostMapping("/register")
    public String registerUser(@RequestParam("fullname") String fullName,
                               @RequestParam("age") int age,
                               @RequestParam("gender") String gender,
                               @RequestParam("email") String email,
                               @RequestParam("bloodtype") String bloodType,
                               @RequestParam("password") String password) {

        // Create a new user object
        User user = new User();
        user.setFullName(fullName);
        user.setAge(age);
        user.setGender(gender);
        user.setUsername(email);
        user.setBloodType(bloodType);
        user.setPassword(password);

        // Save the user to the database
        userRepo.save(user);


        return "redirect:/login";
    }
}
