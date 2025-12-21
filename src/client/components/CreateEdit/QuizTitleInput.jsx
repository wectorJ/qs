export function QuizTitleInput({ title, setTitle, maxTittleLength }) {
  return (
              <div className="form-group">
        <label>
          Quiz Title:
          <span style={{ marginLeft: "8px", fontSize: "0.9em", color: "#666" }}>
            [{title.length} / {maxTittleLength} ] 
          </span>
        </label><br/>
        <input 
          required
          type="text" 
          className="form-input"
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="e.g., Math Basics"
          maxLength={maxTittleLength}
        />
      </div>
  );
}