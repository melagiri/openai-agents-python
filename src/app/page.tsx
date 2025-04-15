"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { evaluateResume } from "@/ai/flows/evaluate-resume";

export default function Home() {
  const [resumeText, setResumeText] = useState<string>("");
  const [criteria, setCriteria] = useState<string>("");
  const [score, setScore] = useState<number | null>(null);
  const [strengths, setStrengths] = useState<string>("");
  const [weaknesses, setWeaknesses] = useState<string>("");
  const [justification, setJustification] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleEvaluate = async () => {
    setIsLoading(true);
    try {
      const result = await evaluateResume({ resumeText, criteria });

      setScore(result.score);
      setStrengths(result.strengths);
      setWeaknesses(result.weaknesses);
      setJustification(result.justification);
    } catch (error) {
      console.error("Error evaluating resume:", error);
      // Handle error appropriately (e.g., display an error message)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resume Insights</h1>

      {/* Resume Upload */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>1. Upload Resume (PDF)</CardTitle>
        </CardHeader>
        <CardContent>
          <Input type="file" accept=".pdf" onChange={handleResumeUpload} />
        </CardContent>
      </Card>

      {/* Criteria Definition */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>2. Define Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter your criteria (skills, experience, keywords)"
            value={criteria}
            onChange={(e) => setCriteria(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Evaluation Button */}
      <Button onClick={handleEvaluate} disabled={isLoading}>
        {isLoading ? "Evaluating..." : "Evaluate Resume"}
      </Button>

      {/* Results Display */}
      {score !== null && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Evaluation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Score: {score}</h2>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Strengths:</h3>
              <p>{strengths}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Weaknesses:</h3>
              <p>{weaknesses}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Justification:</h3>
              <p>{justification}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
