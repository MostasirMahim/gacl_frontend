"use client"
import { useRef, useState } from 'react';
import CustomSelect from './CustomSelect';
import ReactDatePicker from 'react-datepicker';
import staticData from "../assets/staticData.json";

interface DataType {
    btnClass?: string;
}

interface FormEventHandler {
    (event: React.FormEvent<HTMLFormElement>): void;
}

const ReservationForm = ({ btnClass }: DataType) => {

    const personOptions = staticData.ui.reservationForm.personOptions

    const scheduleOptions = staticData.ui.reservationForm.scheduleOptions

    const handleBooking: FormEventHandler = (event) => {
        event.preventDefault()
        const form = event.target as HTMLFormElement;
        form.reset()
        alert(staticData.ui.reservationForm.submitAlert)
    }

    const [startDate, setStartDate] = useState<Date | null>(null);
    const datePickerRef = useRef<ReactDatePicker | null>(null);

    return (
        <>
            <form onSubmit={handleBooking} className='with-label'>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="form-group">
                            <label htmlFor="phone">{staticData.ui.reservationForm.phoneLabel}</label>
                            <input className="form-control" id="phone" name="phone" placeholder={staticData.ui.reservationForm.phonePlaceholder} type="text" autoComplete='off' required />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="form-group">
                            <label htmlFor="subject">{staticData.ui.reservationForm.personLabel}</label>
                            <CustomSelect options={personOptions} selectValue={2} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="input-group date date-picker-one">
                            <label htmlFor="date">{staticData.ui.reservationForm.dateLabel}</label>
                            <ReactDatePicker
                                id='schedule'
                                selected={startDate}
                                onChange={(date: Date | null) => setStartDate(date)}
                                placeholderText={staticData.ui.reservationForm.datePlaceholder}
                                ref={datePickerRef}
                                required
                                wrapperClassName="w-100"
                            />
                            <span
                                className="input-group-addon"
                                onClick={() => datePickerRef.current?.setFocus()}
                            >
                                <i className="fas fa-calendar-alt"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="form-group">
                            <label htmlFor="time">{staticData.ui.reservationForm.timeLabel}</label>
                            <CustomSelect options={scheduleOptions} selectValue={2} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <button type="submit" name="submit" id="submit" className={`${btnClass}`}>
                            {staticData.ui.reservationForm.buttonLabel}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default ReservationForm;
