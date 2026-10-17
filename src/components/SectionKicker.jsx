export default function SectionKicker({ number, title, note }) {
  return <div className="section-kicker"><span>{number} / {title}</span><span className="kicker-rule" /><span>{note}</span></div>;
}
