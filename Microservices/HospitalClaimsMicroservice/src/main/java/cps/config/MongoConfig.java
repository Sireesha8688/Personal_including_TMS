package cps.config;



import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.convert.DefaultMongoTypeMapper;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.beans.factory.annotation.Autowired;
 
import jakarta.annotation.PostConstruct;
 
@Configuration
public class MongoConfig {
 
    @Autowired
    private MappingMongoConverter mappingMongoConverter;
 
    @PostConstruct
    public void setUp() {
        mappingMongoConverter.setTypeMapper(new DefaultMongoTypeMapper(null));
    }
}
 
 