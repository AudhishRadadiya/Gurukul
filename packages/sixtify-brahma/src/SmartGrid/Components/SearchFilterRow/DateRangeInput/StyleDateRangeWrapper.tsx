type StyleDateRangeWrapperProps = {
  children: React.ReactNode;
};

export const StyleDateRangeWrapper = ({
  children,
}: StyleDateRangeWrapperProps) => {
  return (
    <div className="inline-date-range">
      <style>{`
          .inline-date-range .rdrCalendarWrapper {
            font-size: 12px;
            width: auto;
          }
          .inline-date-range .rdrDateDisplayWrapper {
            display: none;
          }
          .inline-date-range .rdrMonthAndYearWrapper {
            padding: 10px 12px !important;
            background: white;
            height: auto;
          }
          .inline-date-range .rdrMonthAndYearPickers {
            display: flex;
            gap: 6px;
            justify-content: center;
            align-items: center;
          }
          .inline-date-range .rdrMonthPicker,
          .inline-date-range .rdrYearPicker {
            margin: 0;
          }
          .inline-date-range .rdrMonthPicker select,
          .inline-date-range .rdrYearPicker select {
            padding: 0px 5px;
            font-size: 12px;
            border: 0px;
            background: white;
            cursor: pointer;
            font-weight: 500;
          }
          .inline-date-range .rdrMonthPicker select:hover,
          .inline-date-range .rdrYearPicker select:hover {
            color: #3b82f6 !important;
          }
          .inline-date-range .rdrMonth {
            padding: 0px 12px;
            width: 200px;
          }
          .inline-date-range .rdrMonthName {
            display: none;
          }
          .inline-date-range .rdrWeekDays {
            margin-bottom: 2px;
          }
          .inline-date-range .rdrWeekDay {
            font-size: 11px;
            font-weight: 600;
            color: #333;
            line-height: 2.2em;
          }
          .inline-date-range .rdrDay {
            font-size: 12px;
            height: 30px;
            line-height: 30px;
          }
          .inline-date-range .rdrDayNumber span {
            font-weight: 400;
            color: #333;
          }
          .inline-date-range .rdrDayToday .rdrDayNumber span:after {
            background: #3b82f6;
            bottom: 2px;
          }
          .inline-date-range .rdrDayPassive .rdrDayNumber span {
            color: #bbb;
          }
          .inline-date-range .rdrStartEdge,
          .inline-date-range .rdrEndEdge {
            background: #3b82f6 !important;
            color: white !important;
          }
          .inline-date-range .rdrInRange {
            background: rgba(59, 131, 246, 0.77) !important;
          }
          .inline-date-range .rdrNextPrevButton {
            background: white;
            border: none;
            width: 20px;
            height: 20px;
            border-radius: 3px;
            margin: 0 2px;
          }
          .inline-date-range .rdrNextPrevButton:hover {
            background: #f5f5f5;
          }
          .inline-date-range .rdrPprevButton i,
          .inline-date-range .rdrNextButton i {
            display: none;
          }
          .inline-date-range .rdrPprevButton::before {
            content: '‹';
            font-size: 18px;
            font-weight: bold;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .inline-date-range .rdrNextButton::before {
            content: '›';
            font-size: 18px;
            font-weight: bold;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .inline-date-range .rdrDefinedRangesWrapper {
            display: none;
          }
        `}</style>

      {children}
    </div>
  );
};
