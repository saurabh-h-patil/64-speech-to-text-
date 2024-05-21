import React, { useState, useEffect } from "react";
import { SpeechRecognition } from "@capacitor-community/speech-recognition";

const Test2 = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const initializePlugin = async () => {
      try {
        await SpeechRecognition.initialize();
        const { state } = await SpeechRecognition.requestPermissions();
        if (state !== "granted") {
          console.error("Permission denied for speech recognition.");
        }
      } catch (error) {
        console.error("Error initializing SpeechRecognition:", error);
      }
    };

    initializePlugin();

    SpeechRecognition.addListener("partialResults", handleResults);
    SpeechRecognition.addListener("results", handleResults);
    SpeechRecognition.addListener("error", handleError);
    SpeechRecognition.addListener("endOfSpeech", handleEndOfSpeech);

    return () => {
      SpeechRecognition.removeAllListeners();
    };
  }, []);

  const handleResults = (event) => {
    setTranscript((prevTranscript) => `${prevTranscript} ${event.matches[0]}`);
  };

  const handleError = (error) => {
    console.error("Speech recognition error:", error);
  };

  const handleEndOfSpeech = () => {
    setIsListening(false);
    startListening(); // Restart listening
  };

  const startListening = async () => {
    try {
      const { state } = await SpeechRecognition.checkPermissions();
      if (state !== "granted") {
        await SpeechRecognition.requestPermissions();
      }

      await SpeechRecognition.start({
        language: "en-IN",
        maxResults: 1000,
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
      <div className="main-content">{transcript}</div>
      <div>
        <button onClick={startListening}>Start Listening</button>
        <button onClick={stopListening}>Stop </button>
      </div>
    </div>
  );
};

export default Test2;
