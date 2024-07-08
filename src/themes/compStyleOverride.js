export default function componentStyleOverrides(theme) {
  const bgColor = theme.colors?.paper;
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: "12px",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        rounded: {
          borderRadius: `${theme?.customization?.borderRadius}px`,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          color: theme.colors?.textDark,
          padding: "24px",
        },
        title: {
          fontSize: "1.125rem",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "12px",         
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: theme.darkTextPrimary,
          //paddingTop: '10px',
          //paddingBottom: '10px',
          "&.Mui-selected": {
            color: theme.menuSelected,
            backgroundColor: theme.menuSelectedBack,
            "&:hover": {
              backgroundColor: theme.menuSelectedBack,
            },
            "& .MuiListItemIcon-root": {
              color: theme.menuSelected,
            },
          },
          "&:hover": {
            backgroundColor: theme.menuSelectedBack,
            color: theme.menuSelected,
            "& .MuiListItemIcon-root": {
              color: theme.menuSelected,
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: theme.darkTextPrimary,
          minWidth: "36px",
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: theme.textDark,
          fontSize: "0.75rem",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: theme.textDark,
          "&::placeholder": {
            color: theme.darkTextSecondary,
            fontSize: "0.875rem",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: bgColor,
          borderRadius: `${theme?.customization?.borderRadius}px`,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.colors?.grey400,
          },
          "&:hover $notchedOutline": {
            borderColor: theme.colors?.primaryLight,
          },
          "&.MuiInputBase-multiline": {
            padding: 1,
          },
        },
        input: {
          fontWeight: 500,
          // background: bgColor,
          padding: "15.5px 14px",
          borderRadius: `${theme?.customization?.borderRadius}px`,
          "&.MuiInputBase-inputSizeSmall": {
            padding: "10px 14px",
            "&.MuiInputBase-inputAdornedStart": {
              paddingLeft: 0,
            },
          },
        },
        inputAdornedStart: {
          paddingLeft: 4,
        },
        notchedOutline: {
          borderRadius: `${theme?.customization?.borderRadius}px`,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          height: "8px",
          "&$vertical": {
            width: 8,
          },
          "&.Mui-disabled": {
            color: theme.colors?.grey300,
          },
        },
        mark: {
          backgroundColor: theme.paper,
          width: 0,
        },
        valueLabel: {
          color: theme?.colors?.primaryLight,
        },
        markLabel: {
          color: "#527AFB",
          fontWeight: "700",
          fontSize: "18px",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: theme.divider,
          opacity: 1,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          color: theme.colors?.primaryMain,
          background: theme.colors?.secondaryLight,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "#DCE4FF",
          borderRadius: "12px",
          "&.MuiChip-deletable .MuiChip-deleteIcon": {
            backgroundColor: "#DCE4FF",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          color: theme.paper,
          background: theme.colors?.grey700,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          color: theme.colors?.primaryDark,
          background: theme.colors?.secondaryLight,
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          background: theme.colors?.primaryLight,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          color: theme.colors?.darkTextSecondary,
          fontSize: "0.75rem",
        },
        columnHeaders: {
          background: theme.colors?.secondaryLight,
          color: theme.colors?.darkTextPrimary,
        },
        cell: {
          borderBottomColor: theme.colors?.grey200,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          border: "1px solid #DDDCE0",
          borderRadius: "0px 0px 12px 12px",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          color: theme.colors?.darkTextSecondary,
          backgroundColor: theme.colors?.secondaryLight,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,

          "& .MuiSwitch-switchBase": {
            padding: 0,
            margin: 2,
            transitionDuration: "300ms",
            "&.Mui-checked": {
              transform: "translateX(16px)",
              color: "#fff",
              "& + .MuiSwitch-track": {
                backgroundColor:
                  theme.backgroundDefault === "#ffffff" ? "#527AFB" : "#2ECA45",
                opacity: 1,
                border: 0,
              },
              "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.5,
              },
            },
            "&.Mui-focusVisible .MuiSwitch-thumb": {
              color: "#33cf4d",
              border: "6px solid #fff",
            },
            "&.Mui-disabled .MuiSwitch-thumb": {
              color:
                theme.backgroundDefault === "#ffffff"
                  ? theme.colors.grey100
                  : theme.colors.grey600,
            },
            "&.Mui-disabled + .MuiSwitch-track": {
              opacity: theme.backgroundDefault === "light" ? 0.3 : 0.7,
            },
          },
          "& .MuiSwitch-thumb": {
            boxSizing: "border-box",
            width: 22,
            height: 22,
          },
          "& .MuiSwitch-track": {
            borderRadius: 26 / 2,
            backgroundColor:
              theme.backgroundDefault === "#ffffff" ? "#E9E9EA" : "#39393D",
            opacity: 1,
          },
        },
      },
    },
  };
}
