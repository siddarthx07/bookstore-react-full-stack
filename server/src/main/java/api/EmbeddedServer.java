package api;

import jakarta.servlet.ServletException;
import org.apache.catalina.Context;
import org.apache.catalina.LifecycleException;
import org.apache.catalina.startup.Tomcat;

import java.io.File;
import java.util.logging.Logger;

public class EmbeddedServer {
    
    private static final Logger logger = Logger.getLogger(EmbeddedServer.class.getName());
    
    public static void main(String[] args) {
        try {
            // Get port from environment or default to 8080
            String portEnv = System.getenv("PORT");
            int port = (portEnv != null && !portEnv.isEmpty()) ? Integer.parseInt(portEnv) : 8080;
            
            logger.info("Starting bookstore server on port " + port);
            
            // Create Tomcat embedded server
            Tomcat tomcat = new Tomcat();
            tomcat.setPort(port);
            tomcat.setHostname("0.0.0.0");
            
            // Set base directory
            String baseDir = System.getProperty("java.io.tmpdir");
            tomcat.setBaseDir(baseDir);
            
            // Create context for the webapp
            Context context = tomcat.addWebapp("", new File("server/src/main/webapp").getAbsolutePath());
            
            // Add context path for the API
            tomcat.getConnector();
            
            // Start the server
            tomcat.start();
            
            logger.info("Server started at http://0.0.0.0:" + port);
            
            // Keep the main thread alive
            tomcat.getServer().await();
            
        } catch (Exception e) {
            logger.severe("Failed to start server: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}

