/**
 * @file EducationSection.jsx
 * @author Alex Kachur
 * @since 2025-10-28
 * @purpose Accordion detailing program highlights while keeping the section compact.
 */
import { memo } from 'react';
import { getId } from '../../utils/getId.js';

function EducationSection({ items = [], openIndex, onToggle }) {
    const safeItems = Array.isArray(items) ? items : [];
    return (
        <section id="education" className="section">
            <span className="section__eyebrow">Education</span>
            <h2 className="section__heading">The coursework shaping my craft</h2>
            <div className="accordion">
                {safeItems.map((item, index) => {
                    const open = openIndex === index;
                    const details = Array.isArray(item.details) ? item.details : [];
                    const key = getId(item) || item.program || index;
                    return (
                        <article
                            key={key}
                            className={`accordion__item ${open ? 'accordion__item--open' : ''}`}
                        >
                            {/* Button keeps the accordion accessible and delegates state back to the parent hook. */}
                            <button
                                type="button"
                                className="accordion__trigger"
                                onClick={() => onToggle(index)}
                            >
                                <div>
                                    <h3>{item.program}</h3>
                                    <p>
                                        {item.school} • {item.period}
                                    </p>
                                </div>
                                <span aria-hidden="true" className="accordion__icon">
                                    {open ? '−' : '+'}
                                </span>
                            </button>
                            <div className="accordion__content">
                                <ul>
                                    {details.map((detail, detailIndex) => (
                                        <li key={`${key}-detail-${detailIndex}`}>{detail}</li>
                                    ))}
                                </ul>
                                <div className="accordion__meta">{item.location}</div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

export default memo(EducationSection);
