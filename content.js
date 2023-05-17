// Create and style the button
const button = document.createElement("button");
button.textContent = "Submit File";
button.style.backgroundColor = "green";
button.style.color = "white";
button.style.padding = "5px";
button.style.border = "none";
button.style.borderRadius = "5px";
button.style.margin = "5px";

// Create the progress elements
const progressBar = document.createElement("div");
progressBar.style.width = "0%";
progressBar.style.height = "100%";
progressBar.style.backgroundColor = "blue";

const progressContainer = document.createElement("div");
progressContainer.style.width = "99%";
progressContainer.style.height = "5px";
progressContainer.style.backgroundColor = "grey";
progressContainer.appendChild(progressBar);

// Find the element to insert before
const targetElement = document.querySelector(".flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4");

// Insert the button and progress elements
targetElement.parentNode.insertBefore(button, targetElement);
targetElement.parentNode.insertBefore(progressContainer, targetElement);

// Event listener for button click
button.addEventListener("click", () => {
  // Create file input element
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".txt, .js, .py, .html, .css, .json, .csv";

  // Event listener for file selection
  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    const filename = file.name;

    // Read the file as text
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;

      const chunkSize = 15000;
      const numChunks = Math.ceil(text.length / chunkSize);

      // Submit chunks of text to conversation
      for (let i = 0; i < numChunks; i++) {
        const start = i * chunkSize;
        const end = (i + 1) * chunkSize;
        const chunk = text.substring(start, end);

        await submitConversation(chunk, i + 1, filename);

        // Update progress bar
        progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;
      }

      // Check if ChatGPT is ready
      let chatgptReady = false;
      while (!chatgptReady) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        chatgptReady = !document.querySelector(".text-2xl > span:not(.invisible)");
      }

      // Set progress bar to blue
      progressBar.style.backgroundColor = "blue";
    };

    reader.readAsText(file);
  });

  // Trigger file input dialog
  fileInput.click();
});

// Function to submit conversation chunk
async function submitConversation(text, part, filename) {
  const textarea = document.querySelector("textarea[tabindex='0']");
  const enterKeyEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  textarea.value = `Part ${part} of ${filename}:\n\n${text}`;
  textarea.dispatchEvent(enterKeyEvent);
}