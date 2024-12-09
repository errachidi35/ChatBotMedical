package com.tabibiMicroserviceInscription.tabibiMicroserviceInscription;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.tabibiMicroserviceInscription.tabibiMicroserviceInscription"})
public class TabibiMicroserviceInscriptionApplication {

	public static void main(String[] args) {
		SpringApplication.run(TabibiMicroserviceInscriptionApplication.class, args);
	}
}
