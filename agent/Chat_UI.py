# streamlit_app.py
import streamlit as st
from datetime import datetime
import time
from SupremoAgent import send_chat_message_Agent  # Import your function here

# ------------------------
# Load the CSS file
# ------------------------
def load_css(file_name):
    with open(file_name) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

load_css("css/style.css")

# ------------------------
# Page layout (Header/Toolbar)
# ------------------------
st.markdown("""<div class="emptybgsection"></div>""", unsafe_allow_html=True)
st.markdown("""<div class="image-border"></div><div class="outerContSection">""", unsafe_allow_html=True)

col1, col2 = st.columns([6, 2])  # 6:2 ratio

with col1:
    st.markdown("<div class='custom-title'>🔍 RAG Chatbot (OCI GenAI Agents)</div>", unsafe_allow_html=True)
    st.markdown("<div class='custom-subtext'>Ask me anything! I’ll fetch relevant info from the Knowledge Base.</div>", unsafe_allow_html=True)

with col2:
    if st.button("🔄 Reset Chat"):
        st.session_state.clear()
        st.rerun()

# ------------------------
# Initialize chat history ONCE
# ------------------------
if "messages" not in st.session_state:
    st.session_state.messages = [
        {
            "role": "assistant",
            "content": "Hi, How can I help you today?",
            "time": datetime.now().strftime("%I:%M:%S %p")
        }
    ]

# ------------------------
# Welcome card (shown once, not part of history)
# ------------------------
welcome_message_html = f"""
<div class="cardBg">
    <h2 style="margin-top:0;">👋 Hello JohnC!</h2>
    <p style="font-size:18px; line-height:1.6;">
        I am your <b>Travel Assistant</b> powered by <b>OCI GenAI</b>. <br>
        Ask me anything about your travel plans:
    </p>
    <ul class="ulCust">
        <li>🚗 Travel details</li>
        <li>🏨 Hotels & stays</li>
        <li>🌦️ Weather updates</li>
    </ul>
    <p class="fbannerTimeStamp"> {datetime.now().strftime("%I:%M:%S %p")}</p>
</div>
"""
st.markdown(welcome_message_html, unsafe_allow_html=True)

# ------------------------
# Display chat history
# ------------------------
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])
        if "time" in msg:
            st.markdown(
                f"<div style='color: gray; font-size: 0.8em;'> {msg['time']}</div>",
                unsafe_allow_html=True
            )

# ------------------------
# Chat Input
# ------------------------
user_input = st.chat_input("Type your question here...")

if user_input:
    current_time = datetime.now().strftime("%I:%M:%S %p")

    # Add user message to history
    st.session_state.messages.append({
        "role": "user",
        "content": user_input,
        "time": current_time
    })

    with st.chat_message("user"):
        st.write(user_input)
        st.markdown(
            f"<div style='color: gray; font-size: 0.8em;'> {current_time}</div>",
            unsafe_allow_html=True
        )

    # ------------------------
    # Show assistant busy/loading indicator
    # ------------------------
    with st.chat_message("assistant"):
        with st.spinner("🤖 Thinking..."):
            start_time = time.time()
            try:
                answer, citation_title = send_chat_message_Agent(message=user_input)
            except Exception as e:
                answer = f"⚠️ Error calling LLM: {e}"
                citation_title = None
            end_time = time.time()
            duration_seconds = round(end_time - start_time, 2)
            response_time = datetime.now().strftime("%I:%M:%S %p")

        # ------------------------
        # Show assistant reply with typing effect
        # ------------------------
        response_placeholder = st.empty()
        streamed_text = ""
        for char in answer:
            streamed_text += char
            response_placeholder.markdown(streamed_text + "▌")
            time.sleep(0.003)  # typing speed
        response_placeholder.markdown(streamed_text)

        if citation_title:
            st.markdown(f"**File Referenced:** 📄 *{citation_title}*")

        st.markdown(
            f"<div style='color: gray; font-size: 0.8em;'> {response_time} "
            f"(⏱ Response Time: {duration_seconds} sec)</div>",
            unsafe_allow_html=True
        )

    # ------------------------
    # Save assistant reply to history
    # ------------------------
    st.session_state.messages.append({
        "role": "assistant",
        "content": streamed_text,
        "citation": citation_title,
        "time": response_time
    })
