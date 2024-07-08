import { isPlainObject } from "lodash";
import { get } from "lodash";
import React, { Fragment } from "react";
import { opsTodisplayHeaders } from "./../utils/opsToDisplayHeaders";
import { opsGetValue } from "./../utils/opsGetValue";
import { Box } from "@mui/material";
import { opsEmpToDisplayHeaders } from "../utils/opsEmpToDisplayHeaders";
import { opsEmpGetValue } from "./../utils/opsEmpGetValue";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CustomTooltip from "../../../../../../../common/CustomTooltip";

const OpsHelperOtherSections = ({
  numOfReferences,
  noOfProfessionalReference,
  items,
  itemHeader,
  sectionHeaders,
  title,
  values,
  empHistory = [],
  empGaps = [],
  headersEmpHistory = [],
  headersEmpGap = [],
  setFieldValue = () => {},
}) => {
  const handleCopyProvidedDetail = (
    header,
    item,
    index,
    headerValue,
    displayIndex
  ) => {
    let finalHeader = headerValue || header;
    let finalName = finalHeader?.getSetFieldName(index, displayIndex);
    let finalValue = item[finalHeader?.getValueFieldName || finalHeader?.value];

    if (headerValue !== undefined && displayIndex !== undefined) {
      finalValue =
        item[header?.value][displayIndex][
          headerValue?.getValueFieldName || headerValue?.value
        ];
    }

    setFieldValue(finalName, finalValue);
  };

  return (
    <>
      {numOfReferences ? (
        <tr>
          <th>Number of references provided for contact details*</th>
          <td>{numOfReferences}</td>
        </tr>
      ) : null}
      {noOfProfessionalReference ? (
        <tr>
          <th>Reason for not providing requested number of references*</th>
          <td>{noOfProfessionalReference}</td>
        </tr>
      ) : null}
      {Array.isArray(items)
        ? items.map((item, index) => (
            <Fragment key={index}>
              {itemHeader(item, index).includes("Question") ? null : (
                <tr>
                  <th>
                    <strong>
                      {itemHeader
                        ? itemHeader(item, index)
                        : `Item ${index + 1}`}
                    </strong>
                  </th>
                  <th>
                    <strong>Provided Details</strong>
                  </th>
                  <td>
                    <strong>Verified Details</strong>
                  </td>
                </tr>
              )}

              {sectionHeaders.map((header) => (
                <>
                  {opsTodisplayHeaders(item, header, title, values[index]) ? (
                    <>
                      {header.headerArray ? (
                        <>
                          {get(item, header.value)?.map(
                            (displayValue, displayIndex) =>
                              header?.headerValues.map(
                                (headerValue, headerIndex) =>
                                  opsTodisplayHeaders(
                                    displayValue,
                                    headerValue,
                                    title,
                                    values[index]
                                  ) ? (
                                    <tr key={displayIndex}>
                                      <th colSpan={1}>
                                        {headerValue.text} - {displayIndex + 1}
                                      </th>
                                      <td>
                                        {opsGetValue(
                                          displayValue,
                                          headerValue,
                                          title
                                        )}
                                      </td>
                                      <td>
                                        {header?.renderField ? (
                                          <td>
                                            {opsGetValue(
                                              displayValue,
                                              headerValue,
                                              title
                                            ) ? (
                                              <Box position="relative">
                                                <Box
                                                  sx={{
                                                    position: "absolute",
                                                    zIndex: "999",
                                                    left: "-27px",
                                                    top: "5px",
                                                    cursor: "pointer",
                                                  }}
                                                  onClick={() =>
                                                    handleCopyProvidedDetail(
                                                      header,
                                                      item,
                                                      index,
                                                      headerValue,
                                                      displayIndex
                                                    )
                                                  }
                                                >
                                                  <CustomTooltip title="Copy provided detail">
                                                    <ContentCopyIcon
                                                      color="primary"
                                                      sx={{
                                                        background: "#EAEFFF",
                                                        borderRadius: "5px",
                                                      }}
                                                    />
                                                  </CustomTooltip>
                                                </Box>
                                              </Box>
                                            ) : null}
                                            <Box ml={1}>
                                              {header?.renderField(
                                                index,
                                                displayIndex
                                              )}
                                            </Box>
                                          </td>
                                        ) : null}
                                      </td>
                                    </tr>
                                  ) : (
                                    <></>
                                  )
                              )
                          )}
                        </>
                      ) : (
                        <tr key={header.value}>
                          <th
                            colSpan={header.heading ? 2 : 1}
                            style={
                              header.heading ? { borderRight: "none" } : {}
                            }
                          >
                            {header.heading ? (
                              <strong>
                                {header.text.replace("{{index}}", index + 1)}
                              </strong>
                            ) : header.text !== "Question" ? (
                              header.text
                            ) : (
                              <strong>{itemHeader(item, index) + "*"}</strong>
                            )}
                          </th>
                          {!header.heading ? (
                            <>
                              <th>{opsGetValue(item, header, title)}</th>
                              {header?.renderField ? (
                                <td>
                                  {opsGetValue(item, header, title) ? (
                                    <Box position="relative">
                                      <Box
                                        sx={{
                                          position: "absolute",
                                          zIndex: "999",
                                          left: "-27px",
                                          top: "5px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleCopyProvidedDetail(
                                            header,
                                            item,
                                            index
                                          )
                                        }
                                      >
                                        <CustomTooltip title="Copy provided detail">
                                          <ContentCopyIcon
                                            color="primary"
                                            sx={{
                                              background: "#EAEFFF",
                                              borderRadius: "5px",
                                            }}
                                          />
                                        </CustomTooltip>
                                      </Box>
                                    </Box>
                                  ) : null}
                                  <Box ml={1}>{header?.renderField(index)}</Box>
                                </td>
                              ) : null}
                            </>
                          ) : null}
                        </tr>
                      )}
                    </>
                  ) : null}
                </>
              ))}
            </Fragment>
          ))
        : null}
      {isPlainObject(items)
        ? sectionHeaders.map((header) =>
            opsTodisplayHeaders(items, header, title, values) ? (
              <>
                {header.headerArray ? (
                  <>
                    {get(items, header.value)?.map(
                      (displayValue, displayIndex) =>
                        header.headerValues.map((headerValue, headerIndex) =>
                          opsTodisplayHeaders(
                            displayValue,
                            headerValue,
                            title,
                            values
                          ) ? (
                            <tr key={displayIndex}>
                              <th colSpan={1}>
                                {headerValue.text} - {displayIndex + 1}
                              </th>
                              <td>
                                {opsGetValue(displayValue, headerValue, title)}
                              </td>
                            </tr>
                          ) : (
                            <></>
                          )
                        )
                    )}
                  </>
                ) : (
                  <tr key={header.value}>
                    <th
                      colSpan={header.heading ? 2 : 1}
                      style={header.heading ? { borderRight: "none" } : {}}
                    >
                      {header.heading ? (
                        <strong>{header.text}</strong>
                      ) : (
                        header.text
                      )}
                    </th>
                    {!header.heading ? (
                      <td>{opsGetValue(items, header, title)}</td>
                    ) : null}
                  </tr>
                )}
              </>
            ) : null
          )
        : null}
      {/*emp history */}
      {Array.isArray(empHistory) && empHistory?.length
        ? empHistory.map((item, index) => (
            <Fragment key={index}>
              <tr>
                <th>
                  <strong>
                    {itemHeader ? itemHeader(item, index) : `Item ${index}`}
                  </strong>
                </th>
                <th>
                  <strong>Provided Details</strong>
                </th>
                <td>
                  <strong>Verified Details</strong>
                </td>
              </tr>

              {headersEmpHistory.map((header) => (
                <>
                  {opsEmpToDisplayHeaders(item, header, values[index]) ? (
                    <>
                      {header.headerArray ? (
                        <>
                          {get(item, header.value)?.map(
                            (displayValue, displayIndex) =>
                              header.headerValues.map(
                                (headerValue, headerIndex) =>
                                  opsEmpToDisplayHeaders(
                                    displayValue,
                                    headerValue,
                                    values[index]
                                  ) && (
                                    <tr key={displayIndex}>
                                      <th colSpan={1}>
                                        {headerValue.text} - {displayIndex + 1}
                                      </th>
                                      <th>
                                        {opsEmpGetValue(
                                          displayValue,
                                          headerValue,
                                          title
                                        )}
                                      </th>
                                      <td>
                                        {opsEmpGetValue(
                                          displayValue,
                                          headerValue,
                                          title
                                        ) ? (
                                          <Box position="relative">
                                            <Box
                                              sx={{
                                                position: "absolute",
                                                zIndex: "999",
                                                left: "-27px",
                                                top: "5px",
                                                cursor: "pointer",
                                              }}
                                              onClick={() =>
                                                handleCopyProvidedDetail(
                                                  header,
                                                  item,
                                                  index,
                                                  headerValue,
                                                  displayIndex
                                                )
                                              }
                                            >
                                              <CustomTooltip title="Copy provided detail">
                                                <ContentCopyIcon
                                                  color="primary"
                                                  sx={{
                                                    background: "#EAEFFF",
                                                    borderRadius: "5px",
                                                  }}
                                                />
                                              </CustomTooltip>
                                            </Box>
                                          </Box>
                                        ) : null}
                                        <Box ml={1}>
                                          {headerValue?.renderField(
                                            index,
                                            displayIndex
                                          )}
                                        </Box>
                                      </td>
                                    </tr>
                                  )
                              )
                          )}
                        </>
                      ) : (
                        <tr key={header.value}>
                          <th
                            colSpan={header.heading ? 2 : 1}
                            style={
                              header.heading ? { borderRight: "none" } : {}
                            }
                          >
                            {header.heading ? (
                              <strong>
                                {header.text.replace("{{index}}", index + 1)}
                              </strong>
                            ) : (
                              header.text
                            )}
                          </th>

                          {!header.heading ? (
                            <>
                              <th>{opsEmpGetValue(item, header, title)}</th>

                              {header?.renderField ? (
                                <td>
                                  {opsGetValue(item, header, title) ? (
                                    <Box position="relative">
                                      <Box
                                        sx={{
                                          position: "absolute",
                                          zIndex: "999",
                                          left: "-27px",
                                          top: "5px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleCopyProvidedDetail(
                                            header,
                                            item,
                                            index
                                          )
                                        }
                                      >
                                        <CustomTooltip title="Copy provided detail">
                                          <ContentCopyIcon
                                            color="primary"
                                            sx={{
                                              background: "#EAEFFF",
                                              borderRadius: "5px",
                                            }}
                                          />
                                        </CustomTooltip>
                                      </Box>
                                    </Box>
                                  ) : null}
                                  <Box ml={1}>{header?.renderField(index)}</Box>
                                </td>
                              ) : null}
                            </>
                          ) : null}
                        </tr>
                      )}
                    </>
                  ) : null}
                </>
              ))}
            </Fragment>
          ))
        : null}

      {/*emp gaps */}
      {Array.isArray(empGaps) && empGaps?.length
        ? empGaps.map((item, index) => (
            <Fragment key={index}>
              <tr>
                <th>
                  <strong>{`Employment Career Gap - ${index + 1}`}</strong>
                </th>
                <th>
                  <strong>Provided Details</strong>
                </th>
                <td>
                  <strong>Verified Details</strong>
                </td>
              </tr>

              {headersEmpGap.map((header) => (
                <>
                  {opsEmpToDisplayHeaders(item, header, values[index]) ? (
                    <tr key={header.value}>
                      <th
                        colSpan={header.heading ? 2 : 1}
                        style={header.heading ? { borderRight: "none" } : {}}
                      >
                        {header.heading ? (
                          <strong>
                            {header.text.replace("{{index}}", index + 1)}
                          </strong>
                        ) : (
                          header.text
                        )}
                      </th>

                      {!header.heading ? (
                        <>
                          <th>{opsEmpGetValue(item, header, title)}</th>

                          {header?.renderField ? (
                            <td>
                              {opsEmpGetValue(item, header, title) ? (
                                <Box position="relative">
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      zIndex: "999",
                                      left: "-27px",
                                      top: "5px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleCopyProvidedDetail(
                                        header,
                                        item,
                                        index
                                      )
                                    }
                                  >
                                    <CustomTooltip title="Copy provided detail">
                                      <ContentCopyIcon
                                        color="primary"
                                        sx={{
                                          background: "#EAEFFF",
                                          borderRadius: "5px",
                                        }}
                                      />
                                    </CustomTooltip>
                                  </Box>
                                </Box>
                              ) : null}
                              <Box ml={1}>{header?.renderField(index)}</Box>
                            </td>
                          ) : null}
                        </>
                      ) : null}
                    </tr>
                  ) : null}
                </>
              ))}
            </Fragment>
          ))
        : null}
    </>
  );
};

export default OpsHelperOtherSections;
