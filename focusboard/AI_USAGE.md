# AI Usage Disclosure

AI tool used: ChatGPT (OpenAI).

## Representative prompts
1. "Help me build a responsive task dashboard using React and Vite."
2. "Implement task creation, editing, deletion, status updates, search and combined filters."
3. "Calculate dashboard statistics from task state and persist task changes in LocalStorage."
4. "Create a responsive Focus Notes carousel with three slides and accessible previous/next controls."

## AI-assisted areas
ChatGPT assisted with the initial project structure, React component implementation, CSS styling, task state logic, LocalStorage persistence, README and this disclosure.

## Verification and correction
The implementation uses React state as the single source of truth and derives statistics and filtered tasks from the current task array. LocalStorage is read only when no saved task data exists, so sample data does not overwrite saved work. I will run the app, test the main interactions and check the layout at 390px, 768px and 1440px before submission.

## Understanding
I will review the code and be prepared to explain the React state flow, immutable updates, derived statistics, effect-based persistence and responsive CSS.
