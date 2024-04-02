// javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://champions-endorsements-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const messagesInDB = ref(database, "Messages")

const publishBtn = document.getElementById("publish-btn")
const textareaEl = document.getElementById("textarea-el")
const messagesEl = document.getElementById("messages")
const messageFrom = document.getElementById("input-from")
const messageTo = document.getElementById("input-to")

publishBtn.addEventListener("click", function() {
  const textareaValue = textareaEl.value
  const messageContent = {
                            text: textareaValue,
                            from: messageFrom.value,
                            to: messageTo.value,
                            likes: 0,
                            isLiked: false
                          }

  if (textareaValue) {
    push(messagesInDB, messageContent)
  }
  clearInputFields()

})

onValue(messagesInDB, function(snapshot) {

  const messagesArr = Object.entries(snapshot.val())

  clearMessagesEl()

  for (let i = 0; i < messagesArr.length; i++) {

    const currentMessage = messagesArr[i]

    appendItemsToMessagesList(currentMessage)
  }
})

function clearMessagesEl() {
  messagesEl.innerHTML = ""
}

function clearInputFields() {
  textareaEl.value = ""
  messageFrom.value = ""
  messageTo.value = ""
}

function appendItemsToMessagesList(message) {

  const messageId = message[0]
  const messageValue = message[1]

  let newEl = document.createElement("div")
  newEl.classList.add("message")

  newEl.innerHTML += `
    <p><strong>To ${messageValue.to}</strong></p>
    <p>${messageValue.text}</p>
    <div class="footer-msg">
      <p><strong>From ${messageValue.from}</strong></p>
      <p>
        <span class="click"><i class="fa-solid fa-heart"></i></span>
        <span>${messageValue.likes}</span>
      </p>
    </div>`

  const clickEl = newEl.querySelector(".click")

  clickEl.addEventListener("click", function() {

    updateLikes(messageId, messageValue)
  })

  messagesEl.append(newEl)
}

function updateLikes(id, message) {

  const isMessageLiked = message.isLiked
  const locatOfMessageInDB = ref(database, `Messages/${id}`)

    if (isMessageLiked === false) {

      let likes = message.likes

      likes++

      update(locatOfMessageInDB, {likes: likes, isLiked: true})
    }
}
