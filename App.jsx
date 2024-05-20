import React, { useState, useEffect } from "react";
import { SpeechRecognition } from "@capacitor-community/speech-recognition";

const SpeechToText = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const initializePlugin = async () => {
      try {
        await SpeechRecognition.initialize();
        await requestPermissions(); // Request permissions after initialization
      } catch (error) {
        console.error("Error initializing SpeechRecognition:", error);
      }
    };

    initializePlugin();

    const addListeners = () => {
      SpeechRecognition.addListener("partialResults", handlePartialResults);
      SpeechRecognition.addListener("results", handleFinalResults);
      SpeechRecognition.addListener("error", handleError);
      SpeechRecognition.addListener("endOfSpeech", handleEndOfSpeech);
    };

    addListeners();

    return () => {
      SpeechRecognition.removeAllListeners();
    };
  }, []);

  const requestPermissions = async () => {
    try {
      const { state } = await SpeechRecognition.requestPermissions();
      if (state !== "granted") {
        console.error("Permission denied for speech recognition.");
      }
    } catch (error) {
      console.error("Permission request error:", error);
    }
  };

  const handlePartialResults = (event) => {
    setTranscript(event.matches[0]);
  };

  const handleFinalResults = (event) => {
    setTranscript(event.matches[0]);
  };

  const handleError = (error) => {
    console.error("Speech recognition error:", error);
  };

  const handleEndOfSpeech = () => {
    setIsListening(false);
  };

  const startListening = async () => {
    try {
      const { state } = await SpeechRecognition.checkPermissions();
      if (state !== "granted") {
        await requestPermissions();
      }

      await SpeechRecognition.start({
        language: "en-US",
        maxResults: 5,
        partialResults: true,
        prompt: "Speak now",
      });
      setIsListening(true);
    } catch (error) {
      console.error("Speech recognition start error:", error);
    }
  };

  const stopListening = async () => {
    try {
      await SpeechRecognition.stop();
      setIsListening(false);
    } catch (error) {
      console.error("Speech recognition stop error:", error);
    }
  };

  return (
    <div className="container">
      <h2>Speech to Text Converter</h2>
      <br />
      <div className="main-content" onClick={() => setTranscript(transcript)}>
        {transcript}
      </div>
      <div>
        <button onClick={startListening} disabled={isListening}>
          Listening
        </button>
        <button onClick={stopListening} disabled={!isListening}>
          stop
        </button>
      </div>
    </div>
  );
};

export default SpeechToText;
