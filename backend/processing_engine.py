from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Dict, Tuple, List

import pandas as pd


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / 'data'


def _read_csv(path: Path, columns: List[str] | None = None) -> pd.DataFrame:
    """Read CSV if present, else return empty DataFrame with optional columns."""
    if path.exists():
        try:
            df = pd.read_csv(path)
            return df
        except Exception:
            # Corrupt or unreadable file; fall back to empty
            return pd.DataFrame(columns=columns or [])
    return pd.DataFrame(columns=columns or [])


def load_csvs() -> Dict[str, pd.DataFrame]:
    """Load all CSVs, handling missing files gracefully with empty defaults.

    Expected files under backend/data/:
      - students.csv: columns ~ [student_id, name, usn, semester, dob]
      - grades.csv: columns ~ [student_id, subject, grade]
      - attendance.csv: columns ~ [student_id, subject, attendance]
      - projects.csv: columns ~ [student_id, project_name, description, tags]
    """
    students = _read_csv(DATA_DIR / 'students.csv', columns=['student_id', 'name', 'usn', 'semester', 'dob'])
    grades = _read_csv(DATA_DIR / 'grades.csv', columns=['student_id', 'subject', 'grade'])
    attendance = _read_csv(DATA_DIR / 'attendance.csv', columns=['student_id', 'subject', 'attendance'])
    projects = _read_csv(DATA_DIR / 'projects.csv', columns=['student_id', 'project_name', 'description', 'tags'])

    # Normalize dtypes where applicable
    for df, col in ((students, 'student_id'), (grades, 'student_id'), (attendance, 'student_id'), (projects, 'student_id')):
        if col in df.columns:
            with pd.option_context('mode.chained_assignment', None):
                try:
                    df[col] = pd.to_numeric(df[col], errors='coerce').astype('Int64')
                except Exception:
                    pass

    return {
        'students': students,
        'grades': grades,
        'attendance': attendance,
        'projects': projects,
    }


def summarize_student(student_id: int) -> Dict:
    """Compute a summary for a student across grades, attendance, and projects.

    Returns a JSON-serializable dict with keys:
      - student: {student_id, name, usn, semester, dob}
      - avg_grade: float | None
      - avg_attendance: float | None
      - subject_details: {subject: grade}
      - attendance_details: {subject: attendance}
      - projects: [ {name, description, tags[]} ]
      - tags: [unique tags]
    """
    data = load_csvs()
    students = data['students']
    grades = data['grades']
    attendance = data['attendance']
    projects = data['projects']

    # Base student info
    student_info = None
    if not students.empty and 'student_id' in students.columns:
        srow = students.loc[students['student_id'] == student_id]
        if not srow.empty:
            sr = srow.iloc[0]
            student_info = {
                'student_id': int(student_id),
                'name': str(sr.get('name')) if 'name' in srow.columns else None,
                'usn': str(sr.get('usn')) if 'usn' in srow.columns else None,
                'semester': int(sr.get('semester')) if 'semester' in srow.columns and pd.notna(sr.get('semester')) else None,
                'dob': str(sr.get('dob')) if 'dob' in srow.columns else None,
            }

    # Grades per subject
    subject_details: Dict[str, float] = {}
    avg_grade = None
    if not grades.empty and {'student_id', 'subject', 'grade'}.issubset(grades.columns):
        gsub = grades.loc[grades['student_id'] == student_id]
        if not gsub.empty:
            # Convert numeric safely
            gsub = gsub.copy()
            gsub['grade'] = pd.to_numeric(gsub['grade'], errors='coerce')
            grouped = gsub.groupby('subject', dropna=True)['grade'].mean()
            subject_details = {str(k): float(v) for k, v in grouped.items() if pd.notna(v)}
            if len(subject_details) > 0:
                avg_grade = float(pd.Series(subject_details.values()).mean())

    # Attendance per subject
    attendance_details: Dict[str, float] = {}
    avg_attendance = None
    if not attendance.empty and {'student_id', 'subject', 'attendance'}.issubset(attendance.columns):
        asub = attendance.loc[attendance['student_id'] == student_id]
        if not asub.empty:
            asub = asub.copy()
            asub['attendance'] = pd.to_numeric(asub['attendance'], errors='coerce')
            agrouped = asub.groupby('subject', dropna=True)['attendance'].mean()
            attendance_details = {str(k): float(v) for k, v in agrouped.items() if pd.notna(v)}
            if len(attendance_details) > 0:
                avg_attendance = float(pd.Series(attendance_details.values()).mean())

    # Projects list and tags aggregation
    projects_list = []
    tags_set = set()
    if not projects.empty and 'student_id' in projects.columns:
        psub = projects.loc[projects['student_id'] == student_id]
        for _, row in psub.iterrows():
            name = str(row.get('project_name')) if 'project_name' in psub.columns else None
            desc = str(row.get('description')) if 'description' in psub.columns else None
            tags_raw = row.get('tags') if 'tags' in psub.columns else None
            row_tags: List[str] = []
            if isinstance(tags_raw, str) and tags_raw.strip():
                row_tags = [t.strip() for t in tags_raw.split(',') if t.strip()]
            for t in row_tags:
                tags_set.add(t)
            projects_list.append({
                'name': name,
                'description': desc,
                'tags': row_tags,
            })

    summary = {
        'student': student_info,
        'avg_grade': avg_grade,
        'avg_attendance': avg_attendance,
        'subject_details': subject_details,
        'attendance_details': attendance_details,
        'projects': projects_list,
        'tags': sorted(tags_set),
    }
    return summary


if __name__ == '__main__':
    # Simple CLI smoke test
    out = summarize_student(1)
    print(json.dumps(out, indent=2))


