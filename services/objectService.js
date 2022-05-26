const ObjectM = require('../models/objectModel');
const User = require('../models/userModel');
const logger = require('../utils/logger');
const colorText = require('../utils/colortext');
const { ObjectId } = require('mongoose').Types;

resultStructure = (operation) => { 
    return result = {
        operation: operation,
        result: "failed",
        message: "",
        data: ""
    }
}

exports.createObject = async (options) => {
    const operation = "Create Object";
    logger.debug( colorText(`${operation} with options ${JSON.stringify(options)}`) );
    
    var result = resultStructure(operation);

    try {
        // Checking if the object exists for the list
        const query = await ObjectM.aggregate([
            { $match:{"title":options.title} },
            { $lookup: { 
                from: "lists", 
                localField: "listId", 
                foreignField: "_id", 
                as: "lists"
            } }, 
            { $match:{"lists._id": ObjectId(options.listId) } }
        ]);
        logger.debug( colorText(`Found on the DB: ${JSON.stringify(query)}`) );
        if(query.length > 0) { result.messsage = `The object ${options.title} already exists on the list`; return result };

        // TODO: Other Validations

        // Create a new object
        logger.debug( colorText("Creating new object") );

        const object = await ObjectM.create(options);

        result.result = "success";
        result.message = "Object Created";
        result.data = object

        logger.debug( colorText(`${operation} ${JSON.stringify(result)}`) );
        return result;
    }catch(error) {
        result.result = "failed";
        result.message = error.message;

        logger.debug( colorText(`${operation} ${JSON.stringify(result)}`) );
    }
}

exports.getAllObjects = async () => {
    const operation = "Query All Objects";
    logger.debug( colorText(`${operation}`) );
    
    var result = resultStructure(operation);

    try{
        // Get object from objects service
        logger.debug( colorText("Getting all objects") );

        const objects = await ObjectM.find({});

        result.result = "success";
        result.message = "List retrieved";
        result.data = objects

        logger.debug( colorText(`${operation} ${JSON.stringify(result)}`) );
        return result;
    }catch(error){
        result.result = "failed";
        result.message = error.message;

        logger.debug( colorText(`${operation} ${JSON.stringify(result)}`) );
    }
}

exports.getAllByListId = async (id) => {
    const operation = `Query Objects for list ${id}`;
    logger.debug( colorText(`${operation}`) );
    
    var result = resultStructure(operation);

    try{
        // Get object from objects service
        logger.debug( colorText("Getting all objects for list") );
        const objects = await ObjectM.find({"listId": ObjectId(id) });

        result.result = "success";
        result.message = "Objects retrieved";
        result.data = objects

        logger.debug( colorText(`${operation} ${JSON.stringify(result)}`) );
        return result;
    }catch(error){
        result.result = "failed";
        result.message = error.message;

        logger.debug( colorText(`${operation} ${JSON.stringify(result)}`) );
    }
}

exports.getAllByListName = async (name, userId) => {
    const operation = `Query Objects for list ${name} user ${userId}`;
    logger.debug( colorText(`${operation}`) );
    
    var result = resultStructure(operation);

    try{
        // Get object from objects service
        logger.debug( colorText("Getting all objects for list") );
        // Queries for the named list
        const query = await User.aggregate([
            { $match:{"_id": ObjectId(userId) } },
            { $lookup: { 
                from: "lists", 
                localField: "lists", 
                foreignField: "_id", 
                as: "lists",
                pipeline: [{ 
                    $match:{"name":name} 
                }]  
            } }, 
            { $project:{"lists":1} } 
        ]);

        // If list exists for the user, queiry all its objects
        if(query[0].lists.length < 1) { result.messsage = `The user doesn't have a list named ${name}`; return result };
        logger.debug( colorText(`Named list found ${JSON.stringify(query[0].lists[0])}`) );
        
        const objects = await ObjectM.find({"listId": ObjectId(query[0].lists[0]._id) });

        result.result = "success";
        result.message = `Objects retrieved for list ${name}`;
        result.data = objects

        logger.debug( colorText(`${operation} ${JSON.stringify(result)}`) );
        return result;
    }catch(error){
        result.result = "failed";
        result.message = error.message;

        logger.debug( colorText(`${operation} ${JSON.stringify(result)}`) );
    }
}

exports.getAllByFilters = async (options) => {
    const operation = `Query Objects with options ${options}`;
    logger.debug( colorText(`${operation}`) );
    
    var result = resultStructure(operation);

    try{
        // Get object from objects service
        logger.debug( colorText("Getting all objects for a List given filter options") );

        const objects = "nothing"

        result.result = "success";
        result.message = "List retrieved";
        result.data = objects

        logger.debug( colorText(`${operation} ${JSON.stringify(result)}`) );
        return result;
    }catch(error){
        result.result = "failed";
        result.message = error.message;

        logger.debug( colorText(`${operation} ${JSON.stringify(result)}`) );
    }
}

exports.getObject = async (id) => {
    const operation = `Query Object ${id}`;
    logger.debug( colorText(`${operation}`) );
    
    var result = resultStructure(operation);

    try{
        // Get object
        logger.debug( colorText("Getting object by id") );

        const object = await ObjectM.findById(id);

        result.result = "success";
        result.message = "List retrieved";
        result.data = object

        logger.debug( colorText(`${operation} ${JSON.stringify(result)}`) );
        return result;
    }catch(error){
        result.result = "failed";
        result.message = error.message;

        logger.debug( colorText(`${operation} ${JSON.stringify(result)}`) );
    }
}

exports.updateObject = async (options, id) => {
    const operation = `Update object ${id}`;
    logger.debug( colorText(`${operation}`) );
    
    var result = resultStructure(operation);

    try{
        // Getting object for Id
        const object = await ObjectM.findById(id);
        
        // Validates which options were provided
        for (const [key, value] of Object.entries(options)) {
            if(value !== undefined) object[key] = value;
        }

        logger.debug( colorText(`New object: ${JSON.stringify(object)}`) );

        await object.save();

        result.result = "success";
        result.message = "List retrieved";
        result.data = object

        logger.debug( colorText(`${operation} ${JSON.stringify(result)}`) );
        return result;
    }catch(error){
        result.result = "failed";
        result.message = error.message;

        logger.debug( colorText(`${operation} ${JSON.stringify(result)}`) );
    }
}

exports.updateObjectFilters = async (options) => {
    const operation = `Update Object with options ${options}`;
    logger.debug( colorText(`${operation}`) );
    
    var result = resultStructure(operation);

    try{
      // Get object
      logger.debug( colorText("Update object filters information") );

      const object = "nothing"

      result.result = "success";
      result.message = "List retrieved";
      result.data = object

      logger.debug( colorText(`${operation} ${JSON.stringify(result)}`) );
      return result;
  }catch(error){
    result.result = "failed";
    result.message = error.message;

    logger.debug( colorText(`${operation} ${JSON.stringify(result)}`) );
  }
}

exports.deleteObject = async (id) => {
    const operation = `Query List ${id}`;
    logger.debug( colorText(`${operation}`) );
    
    var result = resultStructure(operation);

    try{
      // Deleting object
      logger.debug( colorText("Deleting object") );

      result.result = "success";
      result.message = "List retrieved";
      result.data = id

      logger.debug( colorText(`${operation} ${JSON.stringify(result)}`) );
      return result;
  }catch(error){
    result.result = "failed";
    result.message = error.message;

    logger.debug( colorText(`${operation} ${JSON.stringify(result)}`) );
  }
}