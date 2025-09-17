import requests
import oci
from oci.signer import Signer
from oci.config import from_file
import time

# Load OCI config and signer
config = from_file("~/.oci/config", "DEFAULT")
signer = Signer(
    tenancy=config["tenancy"],
    user=config["user"],
    fingerprint=config["fingerprint"],
    private_key_file_location=config["key_file"]
)

# Replace with your actual Agent Endpoint OCID
agent_endpoint_id = "ocid1.genaiagentendpoint.oc1.iad.amaaaaaazxsy2naaav34hxtxyjl7qkrel2k7ln2aopzs6c7cuqtdcppognkq"

def send_chat_message_Agent(message):
    # Step 1: Create session
    session_url = f"https://agent-runtime.generativeai.us-ashburn-1.oci.oraclecloud.com/20240531/agentEndpoints/{agent_endpoint_id}/sessions"
    session_payload = {
        "idleTimeoutInSeconds": 1200
    }
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "opc-request-id": f"req-{int(time.time())}"
    }

    session_response = requests.post(
        url=session_url,
        json=session_payload,
        auth=signer,
        headers=headers
    )

    if session_response.status_code != 200:
        raise Exception(f"❌ Session creation failed: {session_response.status_code} {session_response.text}")

    session_id = session_response.json().get("id")
    if not session_id:
        raise Exception("❌ Session ID missing in response")

    # Step 2: Send chat message using sessionId
    chat_url = f"https://agent-runtime.generativeai.us-ashburn-1.oci.oraclecloud.com/20240531/agentEndpoints/{agent_endpoint_id}/actions/chat"
    chat_payload = {
        "userMessage": message,
        "shouldStream": False,
        "sessionId": session_id
    }

    chat_response = requests.post(
        url=chat_url,
        json=chat_payload,
        auth=signer,
        headers=headers
    )

    if chat_response.status_code == 200:
        content = chat_response.json().get("message", {}).get("content", {})
        answer = content.get("text", "")
        citations = content.get("citations", [])
        title = citations[0].get("title") if citations else None
        return answer, title
    else:
        raise Exception(f"❌ Chat request failed: {chat_response.status_code} {chat_response.text}")
