/**
 * The made-up dataset shared by the Research lessons. Every learner here is a placeholder.
 * Study question: do short daily study sessions lead to better quiz scores than one long weekly session?
 */

/** A clean experiment file: 16 learners, randomly assigned to two groups, with a quiz score at the end. */
export const experimentCsv = `learner_id,group,quiz_score
L01,daily,78
L02,weekly,71
L03,daily,82
L04,weekly,69
L05,daily,75
L06,weekly,74
L07,daily,88
L08,weekly,66
L09,daily,80
L10,weekly,72
L11,daily,77
L12,weekly,70
L13,daily,85
L14,weekly,64
L15,daily,79
L16,weekly,73
`

/** The same kind of file as it arrives from a form: spaces, capitals, a duplicate, blanks and a word for a number. */
export const messyCsv = `learner_id,group,quiz_score
L01,daily,78
L02,Weekly ,71
L03,daily,82
L03,daily,82
L04,weekly,69
L05,daily,
L06,weekly,74
L07,DAILY,88
L08,weekly,66
L09,daily,80
L10,weekly,seventy-two
L11,daily,77
L12,weekly,70
`
