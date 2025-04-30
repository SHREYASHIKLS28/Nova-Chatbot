import { useEffect, useState } from 'react'
import "./assets/app.scss"
import * as webllm from "@mlc-ai/web-llm";

function App() {
  const [count, setCount] = useState(0)
  const [input, setinput] = useState("")
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello, how may I help you?" }
  ]) 
  const [engine, setengine] = useState(null)

  useEffect(() => {
    const selectedModel = "Llama-3.1-8B-Instruct-q4f32_1-MLC";
    webllm.CreateMLCEngine(selectedModel,
      {
        initProgressCallback: (initProgress) => {
          console.log("initProgress", initProgress);
        }
      }).then(engine => {
        setengine(engine)
      })
  }, [])

  async function sendmessagetollm() {
    if (!engine || !input.trim()) {
      console.error("Engine not ready or input is empty");
      return;
    }

    const userMessage = { role: "user", content: input };
    const tempmsg = [...messages, userMessage];
    setMessages(tempmsg); // Show user's message immediately
    setinput(""); // Clear input box

    try {
      const reply = await engine.chat.completions.create({
        messages: tempmsg
      });

      const text = reply.choices[0].message.content;
      const assistantMessage = { role: "assistant", content: text };

      setMessages([...tempmsg, assistantMessage]);
    } catch (error) {
      console.error("LLM Error:", error);
    }
  }

  return (
    <main>
      <section>
        <div className='conversation-area'>
        <div className="tagline">I'm Nova: Your Local, Trusted Companion!</div>

          <div className='messages'>
            {
              messages.map((message, index) => (
                <div className={`message ${message.role}`} key={index}>

                  {message.content}
                </div>
              ))
            }
          </div>
          <div className='input-area'>
            <input 
              onChange={(e) => {
                setinput(e.target.value)
              }}
              value={input}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendmessagetollm()
                }
              }}
              type="text" placeholder='Type your message...' />
            <button onClick={() => {
              sendmessagetollm()
            }}
              className='send-button'>send</button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App;
