const express =  require("express");
const fs = require("fs");

const app=express();


//middleware
app.use((req,res,next)=>{
    console.log(req.url,req.method);
    next();
})
app.use(express.json());
app.get("/",function(req,res){
    res.redirect("/todo")
})
app.get("/todo",function(req,res){
    res.sendFile(__dirname+"/todo.html")
});
app.get("/style-todo.css",function(req,res){
    res.sendFile(__dirname+"/style-todo.css")
});

app.get("/todo.js",function(req,res){
    res.sendFile(__dirname+"/todo.js")
})

app.get("/todos",function(req,res){

    getTodo(null,true,function(error,todos){
        if(error){
            res.status(500)
            res.json({error:error})
        }
        else{
            res.status(200)
            res.json(todos)
        }
    })
})

app.post("/todo",function(req,res){
    const todo = req.body;
    saveTodo(todo,function(error){
        if(error){
            res.status(500)
            res.json({error:error})
        }
        else{
            res.status(200)
            res.send()
        }
    })
})
app.delete("/todo", function (request, response) {
    const todo = request.body;
  
    getTodo(null, true, function (error, todos) {
      if (error) {
        response.status(500);
        response.json({ error: error });
      } else {
        const filteredTodos = todos.filter(function (todoItem) {
          return todoItem.text !== todo.text;
        });
  
        fs.writeFile(
          "todo.jpg",
          JSON.stringify(filteredTodos),
          function (error) {
            if (error) {
              response.status(500);
              response.json({ error: error });
            } else {
              response.status(200);
              response.send();
            }
          }
        );
      }
    });
  });
  
app.put("/todo-status",function(req,response){
    const todo = req.body;
    getTodo(null,true,function(error,todos){
                if(error){
                    response.status(500);
        response.json({ error: error });
                }
                else{
                    const newtodolist = todos.filter(function (todoItem){
                        if(todoItem.text === todo.text){
                            if(todoItem.ischecked === false){
                                todoItem.ischecked = true;
                                return todoItem;
                            }   
                            else{
                                todoItem.ischecked = false;
                                return todoItem;
                            }
                        }
                        return todoItem;
                    })
                    console.log(newtodolist)
                    //------------------------------------------------
                    fs.writeFile("todo.jpg",JSON.stringify(newtodolist),function(error){
                        if (error) {
                            response.status(500);
                            response.json({ error: error });
                          } else {
                            response.status(200);
                            response.send();
                          }
                    })
                }
            })
        }
)


//If recevied an incorrect request
app.get("*",function(req,res){
    res.send("Can not handled")
})

app.listen(8000,function(){
    console.log("Server is running successfully on port 8000");
})

function saveTodo(todo,callback){
    getTodo(null,true,function(error,todos){
        if(error){
            callback(error)
        }
        else{
            todos.push(todo)
            fs.writeFile("todo.jpg",JSON.stringify(todos),function(error){
                if(error){
                    callback(error)
                }
                else{
                    callback()
                }
            })
        }
    })
}

function getTodo(userName,all,callback){
    fs.readFile("todo.jpg","utf-8",function(error,data){
        if(error){
            callback(error)
        }
        else{
        if(data.length === 0){
            data="[]"
        }
        try{
            let todos= JSON.parse(data);
            if (all){
                callback(null,todos)
                return
            }
        }
        catch(error){
            callback(null,[])
        }
    }
    })
}
