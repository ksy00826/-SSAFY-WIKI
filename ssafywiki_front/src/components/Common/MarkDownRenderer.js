import MDX from "@mdx-js/runtime";
import { Link } from "react-router-dom";
import style from "./Component.module.css";
import { getSearchDoc } from "utils/DocsApi";
import { useState, useEffect } from "react";
const MoveDocs = ({ children, docs }) => {
  const [url, setUrl] = useState('');

  const onSearch = (keyword) => {
    getSearchDoc(keyword).then((response) => {
      const output = response.data.hits.hits;
      const newSearched = output.map((element) => {
        return { label: element._source.docs_title, value: element._source.docs_id };
      });
      if (newSearched.length > 0 && newSearched[0].label === keyword) {
        setUrl(`/res/content/${newSearched[0].value}/${newSearched[0].label}`);
      } else {
        setUrl(`/res/list?title=${keyword}`);
      }
    }).catch((error) => {
      console.error('Error searching documents:', error);
      setUrl(`/res/list?title=${keyword}`);
    });
  };

  // onSearch 함수를 호출해서 url 상태를 설정
  useEffect(() => {
    if (docs) {
      onSearch(docs);
    }
  }, [docs]);

  return (
    <Link to={url} className={style.MoveDocs}>
      {children}
    </Link>
  );
};

const Note = ({ children }) => {
  // 툴팁 표시 상태를 관리하기 위한 state를 선언합니다.
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  return (
    <span className={style.noteContainer}
          onMouseEnter={() => setTooltipVisible(true)} // 마우스를 올리면 툴팁을 보여줍니다.
          onMouseLeave={() => setTooltipVisible(false)} // 마우스를 떼면 툴팁을 숨깁니다.
    >
      <span className={style.Note}>[주]</span>
      {isTooltipVisible && <span className={style.tooltip}>{children}</span>}
    </span>
  );
};

const components = {
  MoveDocs, Note 
};

const MarkdownRenderer = ({ content }) => {
  return (
    <div>
      <MDX components={components}>{content}</MDX>
    </div>
  );
};

export default MarkdownRenderer;
