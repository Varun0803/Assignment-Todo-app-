

const todoText = document.getElementById("todo");
const addButton = document.getElementById("Submit");
getTodo();

todoText.addEventListener("onkeypress",function(){
    console.log(event.code)
    })

addButton.addEventListener("click",function(){
    const todoTextvalue = todoText.value;
    if (todoTextvalue){
        saveTodo(todoTextvalue,function(error){ // to add todo to server file 
            if(error){
                alert(error);// if an error msg is received then generate an alert
            }
            else{
                addTodoToDOM(todoTextvalue,false);//display todo to client
                document.getElementById('todo').value = '';//clean the input field after adding
            }
        })
    }
    else{
        alert("please first enter a todo");
    }
});





//to send todo data to server
function saveTodo(todo,callback){
    fetch("/todo",{
        method:"POST",
        headers:{ "Content-Type" : "application/json" },
        body: JSON.stringify({ text: todo,ischecked:false}),
    }).then(function(response){//when the data is sent to server a response will be received  
        if (response.status === 200){
            callback();// then return nothing
        }
        else{
            callback("Something went wrong");// else return an error msg
        }
    })
}

function getTodo(){
    fetch("/todos")
    .then(function(response){
        if (response.status !== 200){
            throw new Error("Something went wrong in gettodo function")
        }
        return response.json()
    })
    .then(function(todos){
        todos.forEach(function(todo){
            if(todo.ischecked === true){
                addTodoToDOM(todo.text,true)
            }
            else{
                addTodoToDOM(todo.text,false)
            }
            
        })
    })
    .catch(function(error){
        alert(error)
    })
}

// to display the todo to client we create a function
function addTodoToDOM(todo,isread){
    const todolist = document.getElementById("todolist");
    const todoItem = document.createElement("li");
    var image=document.createElement("img")
    image.src="https://th.bing.com/th/id/R.870b2e354b200b7f572132ffcdafb475?rik=ltt%2fuBkshly3jQ&riu=http%3a%2f%2f4.bp.blogspot.com%2f-_hPtN6OSUlI%2fUofVgda6szI%2fAAAAAAAAGSM%2fhx7TmrmEc98%2fs1600%2f1-01.jpg&ehk=3gVplgejqRblebejYhW4B1PXn6E63wth5zHAet8G0Z4%3d&risl=&pid=ImgRaw&r=0";
    var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked= isread
        if (checkbox.checked == true){
            todoItem.innerHTML="<del>"+todo+"</del>"
            todoItem.append(image)
            todoItem.append(checkbox)
        }
        else{
            todoItem.innerHTML=todo
            todoItem.append(image)
            todoItem.append(checkbox)
        }

    todolist.appendChild(todoItem);
    image.addEventListener("click", function () {
        deleteTodo(todo, function (error) {
          if (error) {
            alert(error);
          } else {
            todolist.removeChild(todoItem);
          }
        });
      });
    checkbox.addEventListener("change",function(){
        todoCheck(todo,function(error){
                if(error){
                    alert(error);
                }
                else{
                    if (checkbox.checked == true){
                        todoItem.innerHTML="<del>"+todo+"</del>"
                        todoItem.append(image)
                        todoItem.append(checkbox)

                    }
                    else{
                        todoItem.innerHTML=todo
                        todoItem.append(image)
                        todoItem.append(checkbox)
                    }
                }
            })
    })
}

function todoCheck(todo,callback){
    fetch("/todo-status",{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ text: todo}),
    }).then(function(response){
        if (response.status === 200){
            callback();// then return nothing
        }
        else{
            callback("Something went wrong in changing status");// else return an error msg
        }
    })
}
function deleteTodo(todo, callback) {
    fetch("/todo", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: todo}),
    }).then(function (response) {
      if (response.status === 200) {
        callback();
      } else {
        callback("Something went wrong");
      }
    });
  }
