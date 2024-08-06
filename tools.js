(function () {

    function loadFile() {
        document.body.innerHTML += `   <form id="csvForm">
      <input type="file" id="csvFile" accept=".csv" />
      <br />
      <input type="submit" value="Submit" />
   </form>`
        const csvForm = document.getElementById("csvForm");
        const csvFile = document.getElementById("csvFile");
        csvForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const input = csvFile.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                const text = e.target.result;
                const questions = parseQuestions(text)
                let timeout = 4000
                for (const question of questions) {
                    setTimeout(() => {
                        addQuestion(question)
                    }, timeout)
                    timeout += 4000
                }
            };
            reader.readAsText(input)

        });
    }

    function parseQuestions(rawFile) {
        const regex = `"(.*)",multiple-choice,"(.*)","(.*)","(.*)","(.*)",,,,,,,,,,,,([0-9])`
        const regex2 = `"(.*)",multiple-choice,"(.*)",,"(.*)",,"(.*)",,"(.*)",,,,,,"([0-9|,])","(.*)"`
        const regex3 = `"(.*)",multi-select,"(.*)",,"(.*)",,"(.*)",,"(.*)",,,,,,"([0-9|,])","(.*)"`
        const regex4 = `"(.*)",multiple-choice,"(.*)","(.*)","(.*)","(.*)"`
        const questions = []

        let split = rawFile.split('\n')
        for (const line of split) {
            console.log("LINE", line)
            let matches = Array.from(line.matchAll(regex))
            console.log("MATCHES", matches)
            if (matches.length == 0) {
                matches = Array.from(line.matchAll(regex2))
            }
            if (matches.length == 0) {
                matches = Array.from(line.matchAll(regex3))
            }
            if (matches.length == 0) {
                matches = Array.from(line.matchAll(regex4))
            }
            
            if (matches.length > 0) {
                matches = matches[0]
                const question = {
                    "title": matches[1].split('"').join(''),
                    "answers": matches.slice(2, 6),
                    "right_answer": parseInt(matches[6])
                }
                questions.push(question)
            }
        }
        console.log(questions)
        window.questions = questions
        return questions
    }

    function addQuestion(question) {

        setTimeout(() => {
            // Click the add question button
            console.log("IN ADD QUESTION")
            if (!document.querySelector('#quiz_question_text')) {
                document.querySelector('[class="btn btn-md btn-thumb-grey btn-icon"]').click()
                document.querySelector('#quiz_question_text').value = question.title
            }
        }, 1000)


        if (!window.addedFourthAnswer) {
            setTimeout(() => {
                console.log("IN ADDING FOURTH ANSWER")
                document.querySelector('[data-action="click->nested-form#add_association"]').click()
                window.addedFourthAnswer = false
            }, 1500)
        }

        setTimeout(() => console.log("IN CLICK ADD", document.querySelector('[class="btn btn-md btn-thumb-grey btn-icon"]').click()), 2000)

        setTimeout(() => {
                document.querySelector('#quiz_question_text').value = question.title

                console.log('IN ANSWERS FILL TIMEOUT')

                let i = 0
                for (const input of document.querySelectorAll('[data-input-group="true"]')) {
                    if (input.id.toString().includes('quiz_question_answers')) {
                        input.click()
                        input.value = question.answers[i].split('"').join('')
                        console.log('INPUT VALUE', input.value)
                        i += 1
                        // Checking right/wrong for each answer
                        const raw_id = input.id.replace('_text', '')
                        if (question.right_answer == i) {
                            document.querySelector(`#${raw_id}_correct_true`).click()
                        } else {
                            document.querySelector(`#${raw_id}_correct_false`).click()
                        }
                    }
                }
            }, 2500)
        // Get all questions attributes and fill them

        // We click the "Create Question" button
        setTimeout(() => {
            document.querySelector('[data-product-editor--quiz-question-form-target="submit"]').click()
        }, 3000)
    }

    window.importer = {
        loadFile
    }
    loadFile()
})();