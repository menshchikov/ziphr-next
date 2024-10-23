import classNames from "classnames";

export interface PaginatorProps {
    currentPageNum: number,
    totalPagesCount: number,
    pageChanged: (num: number) => void,
}

export const Paginator = (props: PaginatorProps) => {
    const pagesArray = [];
    const left = props.currentPageNum - 1;
    const right = props.currentPageNum + 1;
    let isLeftSpaceInsert = false;
    let isRightSpaceInsert = false;
    for (let i = 1; i <= props.totalPagesCount; i++) {

        if (i < left && i !== 1) {
            if (!isLeftSpaceInsert) {
                pagesArray.push(-1);
                isLeftSpaceInsert = true;
            }
        } else if (i > right && i !== props.totalPagesCount) {
            if (!isRightSpaceInsert) {
                pagesArray.push(-1);
                isRightSpaceInsert = true;
            }
        } else {
            pagesArray.push(i);
        }
    }

    function setPage(num: number) {
        if (num === -1) {
            return;
        }
        props.pageChanged(num);
    }

    function nextPage() {
        if (props.currentPageNum === props.totalPagesCount) {
            return;
        }
        props.pageChanged(props.currentPageNum + 1);
    }

    function prevPage() {
        if (props.currentPageNum === 1) {
            return;
        }
        props.pageChanged(props.currentPageNum - 1);
    }

    return (
        <nav>
            <ul className="flex flex-row justify-center mt-3">
                <li className={classNames([
                    "cursor-pointer px-4 py-2",
                    "border border-solid hover:bg-gray-200",
                    {'disabled': props.currentPageNum === 0},
                ])}
                    onClick={prevPage}
                >
                    <a className="page-link">&lt;</a>
                </li>

                {pagesArray.map((num, index) => {
                        if (num === -1) {
                            return <li key={index} className="px-4 py-2">...</li>;
                        }
                        return <li key={index} className={classNames([
                            "cursor-pointer px-4 py-2",
                            "border border-solid hover:bg-gray-200",
                            {"text-white bg-blue-700": props.currentPageNum === num},
                        ])}
                                   onClick={() => setPage(num)}
                        >
                            {num}
                        </li>
                    }
                )}

                <li className={classNames([
                    "cursor-pointer px-4 py-2",
                    "border border-solid hover:bg-gray-200",
                    {'disabled': props.currentPageNum === props.totalPagesCount - 1},
                ])}
                    onClick={nextPage}
                >
                    <a className="page-link">&gt;</a>
                </li>
            </ul>
        </nav>
    )
}