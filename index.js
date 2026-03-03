
    // get all the data
    function gettask(){
        return JSON.parse(localStorage.getItem("tasks") || "[]");
    }

    // save all the function
    function saveTasks(tasks){
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // live clock
    function updateTimeTicker() {
        const now = new Date();
        const date = now.toLocaleDateString(undefined, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric"
        });
        const time = now.toLocaleTimeString();
        $("#timeTicker").text(`${date} | ${time}`);
    }

    // render task
    function renderTasks(){
        const tasks = gettask();
        const periods = ["Morning", "Afternoon", "Evening", "Night"];
        const grouped = {
            Morning: [],
            Afternoon: [],
            Evening: [],
            Night: []
        };

        tasks.forEach((t, index) => {
            const period = periods.includes(t.period) ? t.period : "Morning";
            grouped[period].push({ task: t, index: index });
        });

        $("#taskGroups").empty();

        periods.forEach((period) => {
            const section = $(`
                <section class="period-section">
                    <h3>${period}</h3>
                    <ul class="taskList"></ul>
                </section>
            `);
            const list = section.find(".taskList");

            if (grouped[period].length === 0) {
                list.append(`<li class="empty">No tasks yet</li>`);
            } else {
                grouped[period].forEach(({ task, index }) => {
                    const li = $(`
                        <li class="${task.done ? "done" : ""}" data-index="${index}">
                            <div class="left">
                                <input class="check" type="checkbox" ${task.done ? "checked" : ""}/>
                                <span class="text">${task.text}</span>
                            </div>
                            <button class="del">Delete</button>
                        </li>
                    `);
                    list.append(li);
                });
            }

            $("#taskGroups").append(section);
        });
    }

    // add new task
    function addTask(){
        const text = $("#taskInput").val().trim();
        const period = $("#taskPeriod").val();
        if(text === "") { alert ("please input a task");  return; }

        const tasks = gettask();
        tasks.push ({text, done: false, period});
        saveTasks(tasks);

        $(`#taskInput`).val("");
        renderTasks();
    }

    // events
    $(document).ready(function(){
        renderTasks();
        updateTimeTicker();
        setInterval(updateTimeTicker, 1000);

        $("#addBtn").on("click", addTask);

        $("#taskInput").on("keypress", function(e){
            if(e.which === 13 ) addTask();  //enter key
        });

        // toggle done

        $("#taskGroups").on("change", ".check", function(){
            const index = $(this).closest("li").data("index");
            const tasks = gettask();
            tasks[index].done = this.checked;
            saveTasks(tasks);
            renderTasks();
        });

        // delete task 
        $("#taskGroups").on("click", ".del",function(){
             const index = $(this).closest("li").data("index");
            const tasks = gettask();
            tasks.splice(index, 1);
            saveTasks(tasks);
            renderTasks();
        });

        // clear all
        $("#clearAll").on("click", function(){
            localStorage.removeItem("tasks");
            renderTasks();
        });
    });

