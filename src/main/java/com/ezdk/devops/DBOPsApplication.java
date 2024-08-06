package com.ezdk.devops;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
//below exclude as we run thproject without a datasource 
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class DBOPsApplication {

	public static void main(String[] args) {
		SpringApplication.run(DBOPsApplication.class, args);
	}

}
