import React, { useState } from "react";

import {
  Box,
  Card,
  Container,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  styled,
  TextField,
  Alert,
  Button,
} from "@mui/material";

import { deleteProduct } from "../../../api/api";
import { checkImageExists } from "../../../helpers/ImageHelper";
import { NotificationType, Product } from "../../../shared/shareddtypes";

const Img = styled("img")({
  display: "block",
  width: "22.2vw",
  height: "22.2vw",
  objectFit: "cover",
});

type DeleteProductProps = {
  products: Product[];
  refreshShop: () => void;
};

export default function DeleteProduct(props: DeleteProductProps): JSX.Element {
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [dialogOpen, setDialogOpen] = useState(0);
  const [image, setImage] = useState("");
  const [notification, setNotification] = useState<NotificationType>({
    severity: "success",
    message: "",
  });

  const products = props.products;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const p = products.find((product) => product.code === event.target.value);
    if (p !== undefined) {
      setCode(p.code);
      setName(p.name);
      setDescription(p.description);
      setPrice(p.price.toString());
      setStock(p.stock.toString());
      setImage(checkImageExists(p.image));
    }
  };

  const handleDeleteProduct = async () => {
    if (code !== "") {
      openDialog();
    } else {
      setNotificationStatus(true);
      setNotification({
        severity: "error",
        message: "Select a product to delete",
      });
    }
  };

  const handleDeleteConfirmed = async () => {
    await deleteProduct(code);
    setNotificationStatus(true);
    setNotification({
      severity: "success",
      message: "Product deleted correctly",
    });
    emptyFields();
    props.refreshShop();
  };

  const emptyFields = () => {
    setCode("");
    setName("");
    setDescription("");
    setStock("");
    setPrice("");
    setImage(checkImageExists("")); // We find the empty image: not-found
  };

  const openDialog = () => {
    setDialogOpen(dialogOpen + 1);
  };
  return (
    <React.Fragment>
      <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <h1 style={{ margin: 8 }}>Delete a product</h1>

          <TextField
            id="outlined-select-currency"
            select
            label="Select"
            fullWidth
            style={{ margin: 8 }}
            onChange={handleChange}
          >
            {products.map((product) => (
              <MenuItem key={product.code} value={product.code}>
                {product.name + " (" + product.description + ")"}
              </MenuItem>
            ))}
          </TextField>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-evenly"
            alignItems="stretch"
          >
            <div>
              <TextField
                disabled
                value={code}
                id="outlined-full-width"
                label="Product code"
                style={{ margin: 8 }}
                type="number"
                fullWidth
                required
                margin="normal"
                variant="outlined"
              />

              <TextField
                disabled
                value={name}
                id="outlined-full-width"
                label="Product name"
                style={{ margin: 8 }}
                fullWidth
                required
                margin="normal"
                variant="outlined"
              />

              <TextField
                disabled
                value={description}
                id="outlined-full-width"
                label="Product description"
                style={{ margin: 8 }}
                fullWidth
                required
                margin="normal"
                variant="outlined"
              />

              <TextField
                disabled
                value={price}
                id="outlined-full-width"
                label="Product price"
                style={{ margin: 8 }}
                fullWidth
                required
                margin="normal"
                type="number"
                variant="outlined"
              />

              <TextField
                disabled
                value={stock}
                id="outlined-full-width"
                label="Product stock"
                style={{ margin: 8 }}
                fullWidth
                type="number"
                required
                margin="normal"
                variant="outlined"
              />
            </div>
            <Box>
              <Card style={{ margin: 8, display: "block" }}>
                <Img src={image} />
              </Card>
            </Box>
          </Stack>
          <Box textAlign="center">
            <Button onClick={handleDeleteProduct}> Delete </Button>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={notificationStatus}
        autoHideDuration={3000}
        onClose={() => {
          setNotificationStatus(false);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
