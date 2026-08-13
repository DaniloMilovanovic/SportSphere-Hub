import { Component, inject } from '@angular/core';
import { FacilityService } from '../../services/facility-service';
import { ReservationService } from '../../services/reservation-service';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employed-calendar-component',
  imports: [FormsModule],
  templateUrl: './employed-calendar-component.html',
  styleUrl: './employed-calendar-component.css',
})
export class EmployedCalendarComponent {
  userService = inject(UserService);

  facilityService = inject(FacilityService);
  reservationService = inject(ReservationService);

    user = this.userService.getUser();
    myFacilities: any[] = [];
    selectedFacility: any = null;
    filteredCourts: any[] = [];
    selectedCourt: any = null;

    weekDays: any[] = [];
    hours: number[] = [];
    currentWeekStart: Date = new Date();
    weekRange: string = '';
    bookedSlots: any[] = [];
    trainingSlots: any[] = [];
    message: string = '';

    ngOnInit() {
        this.currentWeekStart = this.getMonday(new Date());
        this.userService.setPreviousPath("");
        this.generateHours();
        this.userService.getEmployedFacilities(this.user.username).subscribe(data => {
            this.myFacilities = data;
            if (this.myFacilities.length > 0) {
                this.selectedFacility = this.myFacilities[0];
                this.onFacilityChange();
            }
        });
    }

    onFacilityChange() {
        if (this.selectedFacility) {
            this.filteredCourts = this.selectedFacility.courts.filter((c: any) => c.status === 'active');
            if (this.filteredCourts.length > 0) {
                this.selectedCourt = this.filteredCourts[0];
                this.buildWeek();
            }
        }
    }

    onCourtChange() {
        if (this.selectedCourt) {
            this.buildWeek();
        }
    }
    visit(){

    }

    getMonday(date: Date): Date {
        const d = new Date(date);
        const day = d.getUTCDay();
        const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
        return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
    }

    generateHours() {
        this.hours = [];
        for (let h = 0; h < 24; h++) {
            this.hours.push(h);
        }
    }

    buildWeek() {
        this.weekDays = [];
        const dayNames = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];

        for (let i = 0; i < 7; i++) {
            const date = new Date(Date.UTC(
                this.currentWeekStart.getUTCFullYear(),
                this.currentWeekStart.getUTCMonth(),
                this.currentWeekStart.getUTCDate() + i
            ));
            this.weekDays.push({ name: dayNames[i], date: date });
        }

        const endDate = new Date(Date.UTC(
            this.currentWeekStart.getUTCFullYear(),
            this.currentWeekStart.getUTCMonth(),
            this.currentWeekStart.getUTCDate() + 6
        ));

        this.weekRange = `${this.currentWeekStart.getUTCDate()}.${this.currentWeekStart.getUTCMonth() + 1}.${this.currentWeekStart.getUTCFullYear()} - ${endDate.getUTCDate()}.${endDate.getUTCMonth() + 1}.${endDate.getUTCFullYear()}`;

        this.loadBookedSlots();
    }

    previousWeek() {
        this.currentWeekStart = new Date(Date.UTC(
            this.currentWeekStart.getUTCFullYear(),
            this.currentWeekStart.getUTCMonth(),
            this.currentWeekStart.getUTCDate() - 7
        ));
        this.buildWeek();
    }

    nextWeek() {
        this.currentWeekStart = new Date(Date.UTC(
            this.currentWeekStart.getUTCFullYear(),
            this.currentWeekStart.getUTCMonth(),
            this.currentWeekStart.getUTCDate() + 7
        ));
        this.buildWeek();
    }

    loadBookedSlots() {
        if (!this.selectedCourt || !this.selectedFacility) return;

        const startDate = this.weekDays[0].date.toISOString();
        const endDate = this.weekDays[6].date.toISOString();

        this.bookedSlots = [];
        this.trainingSlots = [];

        this.reservationService.getBookedSlotsForWeek(
            this.selectedFacility.name,
            this.selectedCourt.name,
            startDate,
            endDate
        ).subscribe((booked: any[]) => {
            booked.forEach(b => {
                const bookingDate = new Date(b.date);
                const startHour = parseInt(b.startTime.split(":")[0]);
                const endHour = parseInt(b.endTime.split(":")[0]);
                for (let h = startHour; h < endHour; h++) {
                    this.bookedSlots.push({ date: bookingDate, hour: h, username: b.username, status: b.status });
                }
            });
        });

        this.reservationService.getTrainingSessionsForWeek(
            this.selectedFacility.name,
            this.selectedCourt.name,
            startDate,
            endDate
        ).subscribe((trainings: any[]) => {
            trainings.forEach(t => {
                const trainingDate = new Date(t.date);
                const startHour = parseInt(t.startTime.split(":")[0]);
                const endHour = parseInt(t.endTime.split(":")[0]);
                for (let h = startHour; h < endHour; h++) {
                    this.trainingSlots.push({ date: trainingDate, hour: h, trainer: t.trainerFirstName + ' ' + t.trainerLastName, status: t.status });
                }
            });
        });
    }

    isSlotBooked(date: Date, hour: number): boolean {
        return this.bookedSlots.some(slot =>
            slot.date.toISOString() === date.toISOString() && slot.hour === hour
        );
    }

    isTrainingSlot(date: Date, hour: number): boolean {
        return this.trainingSlots.some(slot =>
            slot.date.toISOString() === date.toISOString() && slot.hour === hour
        );
    }

    isWithinWorkingHours(hour: number): boolean {
        if (!this.selectedFacility) return true;
        const openHour = parseInt(this.selectedFacility.workingHours?.open?.split(':')[0] || '0');
        const closeHour = parseInt(this.selectedFacility.workingHours?.close?.split(':')[0] || '24');
        return hour >= openHour && hour < closeHour;
    }

    sameDay(d1: Date, d2: Date): boolean {
        return d1.getUTCFullYear() === d2.getUTCFullYear() &&
            d1.getUTCMonth() === d2.getUTCMonth() &&
            d1.getUTCDate() === d2.getUTCDate();
    }
}
