package com.backend.backend.controller;

import com.backend.backend.entity.TutorialModel;
import com.backend.backend.exception.TutorialNotFoundException;
import com.backend.backend.repository.TutorialRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

//handle HTTP requests and return JSON or other serialized responses.Combines @Controller and @ResponseBody
@RestController
@RequestMapping("/api/v1/tutorial")
@CrossOrigin("http://localhost:8080") // adjust origin if your front end runs elsewhere
public class TutorialController {

    private final TutorialRepository tutorialRepository;

    public TutorialController(TutorialRepository tutorialRepository) {
        this.tutorialRepository = tutorialRepository;
    }

    /**
     * Create a new tutorial entry.
     * @param tutorial payload with all tutorial fields
     * @return the saved TutorialModel
     */


    //create crud - POST
    
    //URL: http://localhost:8080/api/v1/tutorial
    //POSTMAN:   Body -> raw -> JSON
    @PostMapping
    public ResponseEntity<TutorialModel> createTutorial(@RequestBody TutorialModel tutorial) {
        // Initialize collections to avoid null issues
        if (tutorial.getMediaUrls()        == null) tutorial.setMediaUrls(new ArrayList<>());
        if (tutorial.getCategories()       == null) tutorial.setCategories(new ArrayList<>());
        if (tutorial.getOutline()          == null) tutorial.setOutline(new ArrayList<>());
        if (tutorial.getLearningOutcomes() == null) tutorial.setLearningOutcomes(new ArrayList<>());
        if (tutorial.getSkillsGained()     == null) tutorial.setSkillsGained(new ArrayList<>());
        if (tutorial.getDetailsToKnow()    == null) tutorial.setDetailsToKnow(new ArrayList<>());

        TutorialModel saved = tutorialRepository.save(tutorial);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    //Upload a single image file.
    //URL: http://localhost:8080/api/v1/tutorial/image
    //POSTMAN:   Body -> form-data -> file
    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        String folder = "src/main/uploads/images";
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        try {
            File dir = new File(folder);
            if (!dir.exists()) dir.mkdirs();
            Path target = Path.of(folder, filename);
            file.transferTo(target);
            return ResponseEntity.ok(filename);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error uploading file: " + filename);
        }
    }

    
    //Upload multiple image or video files.
    //URL: http://localhost:8080/api/v1/tutorial/{id}/media
    //POSTMAN:   Body -> form-data -> files
    @PostMapping(value = "/{id}/media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<String>> uploadMedia(
            @PathVariable String id,
            @RequestParam("files") List<MultipartFile> files
    ) {
        TutorialModel tut = tutorialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tutorial not found: " + id));

        String folder = "src/main/uploads/media";
        File dir = new File(folder);
        if (!dir.exists()) dir.mkdirs();

        if (tut.getMediaUrls() == null) {
            tut.setMediaUrls(new ArrayList<>());
        }

        for (MultipartFile mf : files) {
            if (tut.getMediaUrls().size() >= 3) break;
            String contentType = mf.getContentType();
            if (contentType == null ||
               !(contentType.startsWith("image/") || contentType.startsWith("video/"))) {
                continue;
            }
            String filename = System.currentTimeMillis() + "_" + mf.getOriginalFilename();
            try {
                Path target = Path.of(folder, filename);
                mf.transferTo(target);
                tut.getMediaUrls().add(filename);
            } catch (IOException ignored) {}
        }

        tutorialRepository.save(tut);
        return ResponseEntity.ok(tut.getMediaUrls());
    }



    //read crud - GET
    
    
    // get all tutorials
    //URL: http://localhost:8080/api/v1/tutorial/viewtutorial
    //POSTMAN:   Body -> raw -> JSON
    
    @GetMapping("/viewtutorial")
    public List<TutorialModel> getAllTutorials() {
        return tutorialRepository.findAll();
    }

    // Get one tutorial by Mongo _id
    //URL: http://localhost:8080/api/v1/tutorial/viewtutorial/{id}
    //POSTMAN:   Body -> raw -> JSON
    
    @GetMapping("/viewtutorial/{id}")
    public TutorialModel getTutorialId(@PathVariable String id) {
        return tutorialRepository.findById(id)
                .orElseThrow(() -> new TutorialNotFoundException(id));
    }

    // Serve cover images
    //URL: http://localhost:8080/api/v1/tutorial/viewtutorial/image/{filename}
    //POSTMAN:   Body -> raw -> JSON
   
    private final String UPLOAD_DIR = "src/main/uploads/images/";

    @GetMapping("/viewtutorial/image/{filename}") // catch the image file name
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename) {
        File file = new File(UPLOAD_DIR + filename);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new FileSystemResource(file));
    }


   
    // Serve media files (images/videos)
    //URL: http://localhost:8080/api/v1/tutorial/viewtutorial/media/{filename}
    //POSTMAN:   Body -> raw -> JSON
    private final String MEDIA_DIR = "src/main/uploads/media/";

    @GetMapping("/viewtutorial/media/{filename}") // catch any media filename
    public ResponseEntity<FileSystemResource> getMedia(@PathVariable String filename) {
        File file = new File(MEDIA_DIR + filename);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new FileSystemResource(file));
    }


    //update crud - PUT
    //URL: http://localhost:8080/api/v1/tutorial/updatetutorial/{id}
    //POSTMAN:   Body -> form-data -> JSON
    //key: tutorialDetails -> Text -> value
    //key: file -> File -> value
    //key: mediaFiles -> File -> value

    @PutMapping(value = "/updatetutorial/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TutorialModel updateTutorial(
            @RequestPart(value = "tutorialDetails") String tutorialDetails,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart(value = "mediaFiles", required = false) List<MultipartFile> mediaFiles,
            @PathVariable String id
    ) {
        System.out.println("Tutorial details: " + tutorialDetails);
    
        if (file != null) {
            System.out.println("File received: " + file.getOriginalFilename());
        } else {
            System.out.println("No file uploaded");
        }
    
        ObjectMapper mapper = new ObjectMapper();
        TutorialModel newTutorial;
    
        try {
            newTutorial = mapper.readValue(tutorialDetails, TutorialModel.class);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing tutorial details: ", e);
        }
    
        return tutorialRepository.findById(id)
                .map((TutorialModel existingTutorial) -> {
                    // Update fields
                    existingTutorial.setTutorialId(newTutorial.getTutorialId());
                    existingTutorial.setTitle(newTutorial.getTitle());
                    existingTutorial.setDescription(newTutorial.getDescription());
                    existingTutorial.setTutorialType(newTutorial.getTutorialType());
                    existingTutorial.setCategories(newTutorial.getCategories());
                    existingTutorial.setDifficulty(newTutorial.getDifficulty());
                    existingTutorial.setEstimatedDuration(newTutorial.getEstimatedDuration());
                    existingTutorial.setOutline(newTutorial.getOutline());
                    existingTutorial.setLearningOutcomes(newTutorial.getLearningOutcomes());
                    existingTutorial.setSkillsGained(newTutorial.getSkillsGained());
                    existingTutorial.setDetailsToKnow(newTutorial.getDetailsToKnow());
    
                    // Handle cover image file update
                    if (file != null && !file.isEmpty()) {
                        String folder = "src/main/uploads/images";
                        File dir = new File(folder);
                        if (!dir.exists()) dir.mkdirs();
    
                        String tutorialImage = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                        try {
                            Path path = Paths.get(folder, tutorialImage);
                            file.transferTo(path);
                            existingTutorial.setTutorialImage(tutorialImage);
                        } catch (IOException e) {
                            throw new RuntimeException("Error saving cover image file", e);
                        }
                    }
    
                    // Handle media files update (replaces old list)
                    if (mediaFiles != null && !mediaFiles.isEmpty()) {
                        String mediaFolder = "src/main/uploads/media";
                        File mediaDir = new File(mediaFolder);
                        if (!mediaDir.exists()) mediaDir.mkdirs();
    
                        List<String> uploadedMedia = new ArrayList<>();
                        for (MultipartFile mf : mediaFiles) {
                            String contentType = mf.getContentType();
                            if (contentType == null ||
                                    !(contentType.startsWith("image/") || contentType.startsWith("video/"))) continue;
    
                            if (uploadedMedia.size() >= 3) break;
    
                            String filename = System.currentTimeMillis() + "_" + mf.getOriginalFilename();
                            try {
                                Path target = Path.of(mediaFolder, filename);
                                mf.transferTo(target);
                                uploadedMedia.add(filename);
                            } catch (IOException ignored) {
                            }
                        }
                        existingTutorial.setMediaUrls(uploadedMedia);
                    }
    
                    return tutorialRepository.save(existingTutorial);
                }).orElseThrow(() -> new TutorialNotFoundException(id));
    }
    

    //delete crud - DELETE
    //
    //POSTMAN:   Body -> raw -> JSON
    //URL: http://localhost:8080/api/v1/tutorial/{id}


    @DeleteMapping("/{id}")
    public String deleteTutorial(@PathVariable String id) {
        //check tutorial is exists db
        TutorialModel tutorialItem = tutorialRepository.findById(id)
                .orElseThrow(() -> new TutorialNotFoundException(id));
        //img delete part
        String tutorialImage = tutorialItem.getTutorialImage();
        if (tutorialImage != null && !tutorialImage.isEmpty()) {
            File imageFile = new File("src/main/uploads/images/" + tutorialImage);
            if (imageFile.exists()) {
                System.out.println("Image Deleted");
            }else {
                System.out.println("failed Image Deleted");
            }
        }

            // Delete media files (images/videos)
        if (tutorialItem.getMediaUrls() != null) {
            for (String media : tutorialItem.getMediaUrls()) {
                File mediaFile = new File("src/main/uploads/media/" + media);
                if (mediaFile.exists() && mediaFile.delete()) {
                    System.out.println("Deleted media file: " + media);
                } else {
                    System.out.println("Failed to delete media file: " + media);
                }
            }
        }

        //Delete item from the repo
        tutorialRepository.deleteById(id);
        return "Deleted tutorial with id: " + id + " image and media deleted ";
    }

}
