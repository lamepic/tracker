import React from "react";
import Autocomplete from "@mui/material/Autocomplete";

function SearchAutocomplete() {
  return (
    <>
      <label>
        <Autocomplete
          sx={{
            display: "inline-block",
            "& input": {
              width: 400,
              color: (theme) =>
                theme.palette.getContrastText(theme.palette.background.paper),
            },
          }}
          id="custom-input-demo"
          options={[{ id: 12, subject: "test" }]}
          // onChange={(event, value) => setDoc(value)}
          isOptionEqualToValue={(option, value) =>
            option.subject.toLowerCase() === value.subject.toLowerCase()
          }
          getOptionLabel={(option) => option.subject}
          renderInput={(params) => (
            <div ref={params.InputProps.ref}>
              <input
                type="text"
                {...params.inputProps}
                placeholder="Search Documents"
              />
            </div>
          )}
          //   renderOption={(props, option) => (
          //     <li {...props} key={option.id}>
          //       <div className="search__item">
          //         <div className="search__item-name">
          //           <p className="search__item-subject">{option.subject}</p>
          //           <p className="search__item-ref">{option.ref}</p>
          //         </div>
          //         <div className="search__item-actions">
          //           {!option.request ? (
          //             <>
          //               {option.route === "outgoing" && (
          //                 <Button
          //                   size="small"
          //                   sx={{ color: "#9d4d01", fontWeight: 600 }}
          //                   onClick={() => handleTrack(option.id)}
          //                 >
          //                   Track
          //                 </Button>
          //               )}

          //               <Button
          //                 size="small"
          //                 sx={{ color: "#9d4d01", fontWeight: 600 }}
          //                 onClick={() => handleView(option.route, option.id)}
          //               >
          //                 View
          //               </Button>
          //             </>
          //           ) : (
          //             <Button
          //               size="small"
          //               sx={{ color: "#9d4d01", fontWeight: 600 }}
          //               onClick={() => handleRequest(option.id)}
          //             >
          //               Request
          //             </Button>
          //           )}
          //         </div>
          //       </div>
          //     </li>
          //   )}
        />
      </label>
    </>
  );
}

export default SearchAutocomplete;
