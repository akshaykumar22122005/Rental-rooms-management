package com.rentalrooms.service;

import com.rentalrooms.dto.ReportDto;
import com.rentalrooms.dto.ReportRequest;
import com.rentalrooms.entity.Property;
import com.rentalrooms.entity.Report;
import com.rentalrooms.entity.User;
import com.rentalrooms.enums.ReportStatus;
import com.rentalrooms.exception.ResourceNotFoundException;
import com.rentalrooms.repository.PropertyRepository;
import com.rentalrooms.repository.ReportRepository;
import com.rentalrooms.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public ReportService(
            ReportRepository reportRepository,
            PropertyRepository propertyRepository,
            UserRepository userRepository
    ) {
        this.reportRepository = reportRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ReportDto reportProperty(Long reporterId, ReportRequest request) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + reporterId));

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + request.getPropertyId()));

        Report report = new Report(property, reporter, request.getReason(), request.getDescription());
        Report saved = reportRepository.save(report);
        return mapToDto(saved);
    }

    public List<ReportDto> getAllReports(ReportStatus status) {
        List<Report> reports;
        if (status != null) {
            reports = reportRepository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            reports = reportRepository.findAllByOrderByCreatedAtDesc();
        }
        return reports.stream().map(this::mapToDto).toList();
    }

    @Transactional
    public ReportDto updateReportStatus(Long reportId, ReportStatus status, String adminNotes) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with ID: " + reportId));

        report.setStatus(status);
        if (adminNotes != null) {
            report.setAdminNotes(adminNotes);
        }

        Report updated = reportRepository.save(report);
        return mapToDto(updated);
    }

    private ReportDto mapToDto(Report report) {
        ReportDto dto = new ReportDto();
        dto.setId(report.getId());
        dto.setPropertyId(report.getProperty().getId());
        dto.setPropertyTitle(report.getProperty().getTitle());
        dto.setReporterId(report.getReporter().getId());
        dto.setReporterName(report.getReporter().getFullName());
        dto.setReporterEmail(report.getReporter().getEmail());
        dto.setReason(report.getReason());
        dto.setDescription(report.getDescription());
        dto.setStatus(report.getStatus());
        dto.setAdminNotes(report.getAdminNotes());
        dto.setCreatedAt(report.getCreatedAt());
        return dto;
    }
}
