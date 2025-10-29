package api;

import org.apache.catalina.Context;
import org.apache.catalina.startup.Tomcat;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.logging.Logger;

public class EmbeddedServer {

    private static final Logger logger = Logger.getLogger(EmbeddedServer.class.getName());

    public static void main(String[] args) {
        try {
            int port = getPort();

            logger.info("Starting bookstore server on port " + port);

            Tomcat tomcat = new Tomcat();
            tomcat.setPort(port);
            tomcat.setHostname("0.0.0.0");
            tomcat.setBaseDir(Files.createTempDirectory("bookstore-tomcat").toString());

            Path webappPath = resolveWebappPath();
            logger.info("Serving static assets from " + webappPath);

            Context context = tomcat.addWebapp("", webappPath.toString());

            tomcat.getConnector();
            tomcat.start();

            logger.info("Server started at http://0.0.0.0:" + port);
            tomcat.getServer().await();

        } catch (Exception e) {
            logger.severe("Failed to start server: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }

    private static int getPort() {
        String portEnv = System.getenv("PORT");
        if (portEnv != null && !portEnv.isEmpty()) {
            try {
                return Integer.parseInt(portEnv);
            } catch (NumberFormatException ignore) {
                // fall through to default
            }
        }
        return 8080;
    }

    private static Path resolveWebappPath() throws IOException, URISyntaxException {
        Path filesystemPath = Paths.get("server/src/main/webapp").toAbsolutePath();
        if (Files.exists(filesystemPath)) {
            return filesystemPath;
        }

        Path tempDir = Files.createTempDirectory("bookstore-webapp");
        copyWebappFromClasspath(tempDir);
        return tempDir;
    }

    private static void copyWebappFromClasspath(Path targetDir) throws IOException, URISyntaxException {
        URL resource = EmbeddedServer.class.getClassLoader().getResource("webapp");
        if (resource == null) {
            throw new IllegalStateException("Unable to locate webapp resources on the classpath.");
        }

        URI resourceUri = resource.toURI();
        if ("jar".equalsIgnoreCase(resourceUri.getScheme())) {
            String resourcePath = resource.toString();
            int separatorIndex = resourcePath.indexOf("!/");
            String jarUriPart = separatorIndex >= 0 ? resourcePath.substring(0, separatorIndex) : resourcePath;
            String entryPath = separatorIndex >= 0 ? resourcePath.substring(separatorIndex + 2) : "";

            try (FileSystem fs = FileSystems.newFileSystem(URI.create(jarUriPart), Collections.emptyMap())) {
                String normalizedEntry = entryPath != null && entryPath.startsWith("/")
                        ? entryPath.substring(1)
                        : entryPath;
                Path jarWebapp = fs.getPath(normalizedEntry == null ? "" : normalizedEntry).normalize();
                copyDirectory(jarWebapp, targetDir);
            }
        } else {
            Path webappPath = Paths.get(resourceUri);
            copyDirectory(webappPath, targetDir);
        }
    }

    private static void copyDirectory(Path source, Path target) throws IOException {
        Files.walkFileTree(source, new SimpleFileVisitor<>() {
            @Override
            public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
                Path relative = source.relativize(dir);
                Files.createDirectories(target.resolve(relative.toString()));
                return FileVisitResult.CONTINUE;
            }

            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                Path relative = source.relativize(file);
                Files.copy(file, target.resolve(relative.toString()), StandardCopyOption.REPLACE_EXISTING);
                return FileVisitResult.CONTINUE;
            }
        });
    }
}
