package com.rentalrooms.service;

import com.rentalrooms.dto.CategoryDto;
import com.rentalrooms.entity.Category;
import com.rentalrooms.exception.BadRequestException;
import com.rentalrooms.exception.ResourceNotFoundException;
import com.rentalrooms.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    public List<CategoryDto> getActiveCategories() {
        return categoryRepository.findByActiveTrue().stream()
                .map(this::mapToDto)
                .toList();
    }

    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        return mapToDto(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        if (categoryRepository.existsByCategoryNameIgnoreCase(dto.getCategoryName().trim())) {
            throw new BadRequestException("Category with name '" + dto.getCategoryName() + "' already exists");
        }

        Category category = new Category();
        category.setCategoryName(dto.getCategoryName().trim());
        category.setDescription(dto.getDescription());
        category.setActive(dto.isActive());

        Category saved = categoryRepository.save(category);
        return mapToDto(saved);
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        category.setCategoryName(dto.getCategoryName().trim());
        category.setDescription(dto.getDescription());
        category.setActive(dto.isActive());

        Category updated = categoryRepository.save(category);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        categoryRepository.delete(category);
    }

    public CategoryDto mapToDto(Category category) {
        return new CategoryDto(
                category.getId(),
                category.getCategoryName(),
                category.getDescription(),
                category.isActive()
        );
    }
}
