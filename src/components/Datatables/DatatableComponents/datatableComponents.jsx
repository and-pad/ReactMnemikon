import React, { useEffect } from 'react';
export const ExpandableComponent = (props) => {
    useEffect(() => {
        const loadGoogleFonts = () => {
            const link = document.createElement('link');
            link.href =
                'https://fonts.googleapis.com/css2?family=Marko+One&family=Asap+Condensed:wght@300&display=swap';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        };

        loadGoogleFonts();
    }, []);

    // Aquí continúa el resto de tu lógica para renderizar `content`...
    let content = [];

    if (props.defColumnsOut !== undefined) {
        props.defColumnsOut.forEach((element, index) => {
            // Lógica para renderizar contenido...
            const isTagsColumn = element.id === 'tags';
            const arrayElements = isTagsColumn
                ? props.data[element.id]?.split(',') || []
                : [];

            content.push(
                <div
                    style={{ fontFamily: 'Asap Condensed', fontSize: '15px', color: '#000000' }}
                    className="text-start mt-2 ms-2 mb-0 border-bottom pb-0"
                    key={`${element.name}-${index}`}
                >
                    {element.name}:
                    {isTagsColumn ? (
                        <div
                            className="d-flex flex-wrap"
                            style={{ fontFamily: 'Asap Condensed, sans-serif', fontSize: '1.1em' }}
                        >
                            {arrayElements.map((item, i) => (
                                <div key={`${item}-${i}`} className="me-2 mb-2">
                                    <div
                                        href="#temp"
                                        style={{
                                            textDecoration: 'none',
                                            height: '1.2em',
                                            paddingTop: '1px',
                                            backgroundColor: '#1e80e1',
                                        }}
                                        className="badge rounded-pill text-dark"
                                    >
                                        {item}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            
                            style={{ fontFamily: 'Asap Condensed, sans-serif', fontSize: '1em', color: '#19191a', fontWeight: "bolder" }}
                        >
                            {props.data[element.id]}
                        </div>
                    )}
                </div>
            );
        });
    }

    return <div>{content}</div>;
};
